import { FormEvent, useEffect, useState } from "react";
import { HeartPulse, Send, ShieldCheck, Sparkles } from "lucide-react";
import drAndreiaPhoto from "../assets/dr-andreia-sampaio.webp";
import type { OndaTeslaState } from "../state/ondaTeslaState";

interface SupportScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
}

interface SupportMessage {
  readonly id: string;
  readonly role: "assistant" | "user";
  readonly text: string;
}

const SUPPORT_STORAGE_KEY = "bananaDrAndreiaSupportMessagesV2";

const quickQuestions = [
  "Doutora, quero a receita",
  "Posso tomar o chá à noite?",
  "Bateu vontade de doce",
  "Como faço o check-in?"
];

const appKnowledge = `
Você responde como Dra. Andreia Sampaio, suporte educativo do Banana App.
Escreva em português do Brasil, com tom humano, curto, acolhedor e prático.
Não use tom de robô. Não diga que é inteligência artificial. Não use frases genéricas como "consulte o app".
Responda como se estivesse orientando uma cliente no WhatsApp: primeiro acolha, depois dê o passo exato.

Você conhece:
- Plano de 21 dias do Banana App.
- Receita da Banana Bariátrica.
- Truque da Banana com casca de 1 banana bem higienizada, 1 litro de água, gengibre fresco, canela e 2 cravos-da-índia.
- Chá Noturno Japonês para rotina leve e controle de beliscos, com versão sem cafeína à noite.
- Check-in diário: receita feita, água, inchaço, vontade de doce, fome, disposição, peso, cintura e observação.
- O foco do app é constância, microvitórias, hidratação, check-in e rotina simples.

Regras:
- Nunca prometa emagrecimento garantido, cura ou resultado específico.
- Não faça diagnóstico.
- Quando houver gestação, amamentação, uso de remédios, doença, dor forte, reação ruim ou restrição alimentar, oriente procurar profissional.
- Prefira respostas úteis em 3 a 7 frases.
`;

const initialMessage: SupportMessage = {
  id: "initial",
  role: "assistant",
  text: "Oi, minha querida. Aqui é a Dra. Andreia Sampaio. Me diga o que está travando hoje: receita, chá, vontade de doce, água ou check-in? Vou te orientar pelo próximo passo."
};

export function SupportScreen({ active, state }: SupportScreenProps) {
  const [messages, setMessages] = useState<SupportMessage[]>(() => loadSupportMessages());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  async function submitQuestion(question: string) {
    const clean = question.trim();
    if (!clean || loading) return;

    const userMessage: SupportMessage = {
      id: makeMessageId("user"),
      role: "user",
      text: clean
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      await waitForNaturalReply();
      const answer = await askAndreiaAi(clean, state);
      setMessages((current) => [...current, { id: makeMessageId("assistant"), role: "assistant", text: cleanDoctorAnswer(answer) }]);
    } catch {
      await waitForNaturalReply(500);
      setMessages((current) => [...current, { id: makeMessageId("assistant"), role: "assistant", text: localSupportAnswer(clean) }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(input);
  }

  return (
    <section className={`screen neuro-screen support-screen ${active ? "active" : ""}`}>
      <header className="support-hero">
        <div className="support-doctor-photo">
          <img src={drAndreiaPhoto} alt="Dra. Andreia Sampaio" />
        </div>
        <div>
          <span className="protocol-eyebrow"><HeartPulse size={14} /> Suporte da doutora</span>
          <h1>Dra. Andreia Sampaio</h1>
          <p>Ajuda prática para receita, chás, vontade de doce, água e check-ins do seu plano.</p>
        </div>
      </header>

      <div className="support-quick-actions">
        {quickQuestions.map((question) => (
          <button key={question} type="button" onClick={() => void submitQuestion(question)}>
            <Sparkles size={15} />
            {question}
          </button>
        ))}
      </div>

      <section className="support-chat" aria-label="Chat com a Dra. Andreia Sampaio">
        <div className="support-chat-list">
          {messages.map((message) => (
            <article className={`support-message ${message.role}`} key={message.id}>
              {message.role === "assistant" ? <img src={drAndreiaPhoto} alt="" /> : null}
              <p>{message.text}</p>
            </article>
          ))}
          {loading ? (
            <article className="support-message assistant typing">
              <img src={drAndreiaPhoto} alt="" />
              <p>Dra. Andreia está lendo sua mensagem...</p>
            </article>
          ) : null}
        </div>

        <form className="support-chat-form" onSubmit={handleSubmit}>
          <input
            aria-label="Mensagem para a Dra. Andreia"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Escreva sua dúvida..."
          />
          <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar pergunta">
            <Send size={18} />
          </button>
        </form>
      </section>

      <section className="support-safety-note">
        <ShieldCheck size={18} />
        <p>Orientação educativa. Se você usa remédios, está gestante, amamentando, tem alguma condição de saúde ou sentiu desconforto, fale com um profissional antes de usar novas receitas.</p>
      </section>
    </section>
  );
}

function loadSupportMessages() {
  try {
    const raw = localStorage.getItem(SUPPORT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) as SupportMessage[] : null;
    return parsed?.length ? parsed : [initialMessage];
  } catch {
    return [initialMessage];
  }
}

async function askAndreiaAi(question: string, state: OndaTeslaState) {
  const profile = state.userProfile
    ? `Nome: ${state.userProfile.name}. Perfil: ${state.userProfile.profileName}. Objetivo: ${state.userProfile.mainGoal}. Dificuldade: ${state.userProfile.mainDifficulty}.`
    : "Perfil ainda não preenchido.";

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify({
      model: "openai-fast",
      temperature: 0.55,
      messages: [
        { role: "system", content: `${appKnowledge}\nContexto da cliente: ${profile}` },
        { role: "user", content: question }
      ]
    })
  }).finally(() => window.clearTimeout(timeout));

  if (!response.ok) throw new Error("AI request failed");
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error("Empty AI response");
  if (answer.toLowerCase().includes("pollinations legacy text api")) throw new Error("Provider notice");
  return answer;
}

function localSupportAnswer(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes("truque") || normalized.includes("banana") || normalized.includes("receita")) {
    return "Claro, minha querida. Para o Truque da Banana de hoje, use a casca de 1 banana bem higienizada, 1 litro de água, um pedacinho de gengibre, canela e 2 cravos-da-índia. Aqueça a água, coloque tudo em infusão por 10 a 15 minutos, coe e tome morno ou frio. O mais importante é higienizar bem a casca e marcar no app quando fizer. Se você tiver restrição alimentar, usar remédio ou estiver gestante/amamentando, confirme antes com um profissional.";
  }

  if (normalized.includes("chá") || normalized.includes("cha") || normalized.includes("noite")) {
    return "Pode sim, mas para a noite eu prefiro a versão sem chá preto, porque ele tem cafeína. Faça com hibisco, cravo, canela e alecrim, deixe descansar uns 10 minutos e tome depois do jantar. Use como ritual de cozinha fechada: tomou o chá, espere 10 minutos antes de beliscar. Depois registra no check-in se a vontade de doce baixou.";
  }

  if (normalized.includes("doce") || normalized.includes("belisc")) {
    return "Respira, isso acontece muito. Agora faz o combinado: bebe um copo de água, espera 10 minutos e pergunta se é fome real ou vontade automática. Se continuar, escolha algo simples e não transforme isso em culpa. O importante é registrar no check-in, porque é assim que a gente descobre o horário e o gatilho da sua vontade de doce.";
  }

  if (normalized.includes("check") || normalized.includes("progresso") || normalized.includes("peso")) {
    return "O check-in não é para te julgar, é para ajustar sua rotina. Mesmo se o peso não mudar hoje, registre água, inchaço, vontade de doce, fome, disposição e cintura. Às vezes a primeira melhora aparece em menos belisco, mais constância ou barriga menos pesada. Esse registro é o que mostra o caminho.";
  }

  return "Entendi. Para eu te orientar melhor, me diga se sua dúvida é sobre a receita, o chá da noite, vontade de doce, água ou check-in. Se for para hoje, minha orientação inicial é simples: faça a receita possível, beba água e registre como foi. Não precisa perfeito, precisa feito.";
}

function cleanDoctorAnswer(answer: string) {
  return answer
    .replace(/\bIA\b/gi, "")
    .replace(/inteligência artificial/gi, "")
    .replace(/assistente virtual/gi, "Dra. Andreia")
    .trim();
}

function waitForNaturalReply(extraDelay = 0) {
  const delay = 1200 + extraDelay + Math.floor(Math.random() * 900);
  return new Promise((resolve) => window.setTimeout(resolve, delay));
}

function makeMessageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
