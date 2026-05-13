"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Lock, Mail, ShieldCheck, User } from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
          renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
        };
      };
    };
  }
}

interface GoogleInitializeConfig {
  readonly client_id: string;
  readonly callback: (response: { credential?: string }) => void;
  readonly ux_mode?: "popup" | "redirect";
}

interface GoogleButtonOptions {
  readonly theme?: "outline" | "filled_blue" | "filled_black";
  readonly size?: "large" | "medium" | "small";
  readonly shape?: "rectangular" | "pill" | "circle" | "square";
  readonly text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  readonly width?: string | number;
  readonly locale?: string;
}

const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    float time = iTime * 0.38;
    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;
    vec2 distortion = centeredUV;
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.38 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.38 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }
    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.82, 0.18, wave);
    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface SmokeyBackgroundProps {
  readonly backdropBlurAmount?: BlurSize;
  readonly color?: string;
  readonly className?: string;
}

interface LoginFormProps {
  readonly mode: "login" | "register";
  readonly error?: string;
  readonly googleClientId?: string;
  readonly loading?: boolean;
  readonly onModeChange: (mode: "login" | "register") => void;
  readonly onGoogleCredential?: (credential: string) => void;
  readonly onGoogleError?: (message: string) => void;
  readonly onSubmit: (data: { email: string; name: string; password: string }) => void;
}

export function SmokeyBackground({
  backdropBlurAmount = "sm",
  color = "#41f6df",
  className = ""
}: SmokeyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, hovering: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");
    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);
    const startTime = Date.now();
    let frame = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, mouseRef.current.hovering ? mouseRef.current.x : width / 2, mouseRef.current.hovering ? height - mouseRef.current.y : height / 2);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, hovering: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, hovering: false };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    render();

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [color]);

  return (
    <div className={`smokey-bg ${className}`} data-blur={backdropBlurAmount}>
      <canvas ref={canvasRef} />
      <div />
    </div>
  );
}

export function LoginForm({
  error,
  googleClientId,
  loading = false,
  mode,
  onGoogleCredential,
  onGoogleError,
  onModeChange,
  onSubmit
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const isRegister = mode === "register";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ email, name, password });
  }

  return (
    <section className="login-card" aria-label="Acesso Banana App">
      <div className="login-card-head">
        <span><ShieldCheck size={15} /> Plano privado</span>
        <h1>{isRegister ? "Crie seu acesso" : "Entre no seu plano"}</h1>
        <p>{isRegister ? "Guarde seu progresso de 21 dias neste dispositivo." : "Use o mesmo e-mail da sua compra para continuar."}</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        {isRegister ? (
          <label className="floating-field">
            <User size={17} />
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome" autoComplete="name" />
          </label>
        ) : null}
        <label className="floating-field">
          <Mail size={17} />
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail da compra" type="email" autoComplete="email" required />
        </label>
        <label className="floating-field">
          <Lock size={17} />
          <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required />
        </label>
        {error ? <p className="login-error">{error}</p> : null}
        <button className="protocol-primary login-submit" type="submit" disabled={loading}>
          {loading ? "Validando..." : isRegister ? "Criar conta" : "Entrar"}
          <ArrowRight size={18} />
        </button>
      </form>
      <div className="login-divider"><span />OU CONTINUE COM<span /></div>
      <GoogleSignIn clientId={googleClientId} onCredential={onGoogleCredential} onError={onGoogleError} />
      <p className="login-switch">
        {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
        <button type="button" onClick={() => onModeChange(isRegister ? "login" : "register")}>
          {isRegister ? "Entrar" : "Criar acesso"}
        </button>
      </p>
    </section>
  );
}

interface GoogleSignInProps {
  readonly clientId?: string;
  readonly onCredential?: (credential: string) => void;
  readonly onError?: (message: string) => void;
}

function GoogleSignIn({ clientId, onCredential, onError }: GoogleSignInProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    setFailed(false);
    setReady(false);
    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !window.google || !buttonRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response.credential) {
              onError?.("O Google não devolveu uma credencial válida.");
              return;
            }
            onCredential?.(response.credential);
          },
          ux_mode: "popup"
        });
        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 320,
          locale: "es_419"
        });
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential, onError]);

  if (!clientId) {
    return (
      <div className="google-config-warning">
        <GoogleIcon />
        <span>Configure VITE_GOOGLE_CLIENT_ID para ativar o Google.</span>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="google-config-warning">
        <GoogleIcon />
        <span>Não foi possível carregar o Google agora. Recarregue a página e tente novamente.</span>
      </div>
    );
  }

  return (
    <div className="google-slot" aria-busy={!ready}>
      <div ref={buttonRef} />
      {!ready ? <span>Carregando Google...</span> : null}
    </div>
  );
}

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript() {
  if (window.google) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;
  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return googleScriptPromise;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.613 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5S45.5 36.017 45.5 24c0-1.538-.135-3.022-.389-4.417z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.839-5.841C34.553 4.806 29.613 2.5 24 2.5C16.318 2.5 9.642 6.723 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 45.5c5.613 0 10.553-2.306 14.802-6.341l-5.839-5.841C30.842 35.846 27.059 38 24 38c-5.039 0-9.345-2.608-11.124-6.481l-6.571 4.819C9.642 41.277 16.318 45.5 24 45.5z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.839 5.841C44.196 35.123 45.5 29.837 45.5 24c0-1.538-.135-3.022-.389-4.417z" />
    </svg>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.substring(0, 2), 16) / 255;
  const g = parseInt(normalized.substring(2, 4), 16) / 255;
  const b = parseInt(normalized.substring(4, 6), 16) / 255;
  return [r, g, b];
}
