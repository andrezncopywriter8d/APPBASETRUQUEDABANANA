export const AUTH_DB_KEY = "ondaTeslaAuthDb";
export const AUTH_SESSION_KEY = "ondaTeslaAuthSession";

export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly passwordHash?: string;
  readonly provider?: "password" | "google";
  readonly googleSub?: string;
  readonly picture?: string;
  readonly createdAt: string;
  readonly lastLoginAt: string | null;
}

export interface AuthSession {
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  readonly provider?: "password" | "google";
  readonly picture?: string;
  readonly startedAt: string;
}

interface AuthDb {
  readonly users: readonly AuthUser[];
}

export interface AuthResult {
  readonly ok: boolean;
  readonly message: string;
  readonly session?: AuthSession;
}

export function loadAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) as AuthSession : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export async function loginWithPassword(email: string, password: string): Promise<AuthResult> {
  const db = loadDb();
  const normalized = normalizeEmail(email);
  const user = db.users.find((item) => item.email === normalized);
  if (!user) return { ok: false, message: "No encontramos una cuenta con ese correo." };
  if (!user.passwordHash) return { ok: false, message: "Esta cuenta usa acceso con Google." };
  const hash = await hashPassword(password, normalized);
  if (hash !== user.passwordHash) return { ok: false, message: "Correo o contraseña incorrectos." };
  const session = makeSession(user);
  const users = db.users.map((item) => item.id === user.id ? { ...item, lastLoginAt: new Date().toISOString() } : item);
  saveDb({ users });
  saveAuthSession(session);
  return { ok: true, message: "Sesión iniciada.", session };
}

export async function registerWithPassword(name: string, email: string, password: string): Promise<AuthResult> {
  const db = loadDb();
  const normalized = normalizeEmail(email);
  if (!name.trim()) return { ok: false, message: "Escribe tu nombre." };
  if (!isValidEmail(normalized)) return { ok: false, message: "Escribe un correo válido." };
  if (password.length < 8) return { ok: false, message: "Usa al menos 8 caracteres." };
  if (db.users.some((item) => item.email === normalized)) return { ok: false, message: "Ese correo ya tiene una cuenta." };
  const now = new Date().toISOString();
  const user: AuthUser = {
    id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: name.trim(),
    email: normalized,
    passwordHash: await hashPassword(password, normalized),
    provider: "password",
    createdAt: now,
    lastLoginAt: now
  };
  saveDb({ users: [...db.users, user] });
  const session = makeSession(user);
  saveAuthSession(session);
  return { ok: true, message: "Cuenta creada.", session };
}

export async function loginWithGoogleCredential(credential: string): Promise<AuthResult> {
  const profile = decodeGoogleCredential(credential);
  if (!profile?.email || !profile.sub) {
    return { ok: false, message: "Não conseguimos validar sua conta Google." };
  }

  const normalized = normalizeEmail(profile.email);
  if (!isValidEmail(normalized)) {
    return { ok: false, message: "O Google não devolveu um e-mail válido." };
  }

  const db = loadDb();
  const now = new Date().toISOString();
  const existing = db.users.find((item) => item.email === normalized || item.googleSub === profile.sub);
  const user: AuthUser = existing
    ? {
      ...existing,
      name: profile.name || existing.name,
      email: normalized,
      provider: existing.provider ?? "google",
      googleSub: profile.sub,
      picture: profile.picture ?? existing.picture,
      lastLoginAt: now
    }
    : {
      id: `google-${profile.sub}`,
      name: profile.name || normalized.split("@")[0],
      email: normalized,
      provider: "google",
      googleSub: profile.sub,
      picture: profile.picture,
      createdAt: now,
      lastLoginAt: now
    };

  const users = existing
    ? db.users.map((item) => item.id === existing.id ? user : item)
    : [...db.users, user];
  saveDb({ users });
  const session = makeSession(user);
  saveAuthSession(session);
  return { ok: true, message: "Sessão iniciada com Google.", session };
}

export function exportAuthDb() {
  return loadDb();
}

function makeSession(user: AuthUser): AuthSession {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider,
    picture: user.picture,
    startedAt: new Date().toISOString()
  };
}

interface GoogleJwtProfile {
  readonly sub: string;
  readonly email: string;
  readonly name?: string;
  readonly picture?: string;
}

function decodeGoogleCredential(credential: string): GoogleJwtProfile | null {
  try {
    const [, payload] = credential.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = decodeURIComponent(
      Array.from(atob(padded))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(decoded) as GoogleJwtProfile;
  } catch {
    return null;
  }
}

function loadDb(): AuthDb {
  try {
    const raw = localStorage.getItem(AUTH_DB_KEY);
    return raw ? JSON.parse(raw) as AuthDb : { users: [] };
  } catch {
    return { users: [] };
  }
}

function saveDb(db: AuthDb) {
  localStorage.setItem(AUTH_DB_KEY, JSON.stringify(db));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function hashPassword(password: string, email: string) {
  const input = `onda-tesla::${email}::${password}`;
  if (crypto.subtle) {
    const encoded = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
  }
  return `fallback-${hash}`;
}
