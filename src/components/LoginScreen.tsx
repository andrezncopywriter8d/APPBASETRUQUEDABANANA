import { useState } from "react";
import { LoginForm, SmokeyBackground } from "./ui/login-form";
import { loginWithGoogleCredential, loginWithPassword, registerWithPassword, type AuthSession } from "../state/authState";

interface LoginScreenProps {
  readonly onAuthenticated: (session: AuthSession) => void;
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(data: { email: string; name: string; password: string }) {
    setLoading(true);
    setError("");
    const result = mode === "register"
      ? await registerWithPassword(data.name, data.email, data.password)
      : await loginWithPassword(data.email, data.password);
    setLoading(false);
    if (!result.ok || !result.session) {
      setError(result.message);
      return;
    }
    onAuthenticated(result.session);
  }

  async function submitGoogle(credential: string) {
    setLoading(true);
    setError("");
    const result = await loginWithGoogleCredential(credential);
    setLoading(false);
    if (!result.ok || !result.session) {
      setError(result.message);
      return;
    }
    onAuthenticated(result.session);
  }

  return (
    <main className="login-shell">
      <SmokeyBackground color="#41f6df" backdropBlurAmount="sm" />
      <div className="login-brand">
        <strong>Banana App</strong>
        <span>Plano personalizado privado</span>
      </div>
      <div className="login-center">
        <LoginForm
          error={error}
          googleClientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
          loading={loading}
          mode={mode}
          onGoogleCredential={submitGoogle}
          onGoogleError={setError}
          onModeChange={setMode}
          onSubmit={submit}
        />
      </div>
      <p className="login-footnote">Use o mesmo e-mail da sua compra para acessar seu plano.</p>
    </main>
  );
}
