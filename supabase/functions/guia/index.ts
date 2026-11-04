// Guia IA do Viajador: recebe a pergunta e o trecho do guia, e pergunta ao Gemini.
// A chave do Gemini fica no segredo GEMINI_API_KEY e nunca chega ao site.

const MODELOS = (Deno.env.get("GEMINI_MODEL") ?? "gemini-3.6-flash,gemini-3.5-flash-lite,gemini-3.8-flash")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

const INSTRUCOES = `Você é o guia de viagem do app Viajador, um amigo uruguaio que morou no Brasil.
Responda em português do Brasil, de forma simpática e direta, em no máximo 120 palavras, a não ser que peçam mais detalhes.
Use apenas os fatos do CONTEXTO DO GUIA. Se a resposta não estiver lá, diga que não sabe com certeza e sugira onde perguntar.
Não invente datas, nomes, preços nem horários. Para horários e preços, sempre diga para confirmar no local.
Quando ajudar, ensine uma frase curta em espanhol do Uruguai. Prefira as frases do CONTEXTO e escreva a pronúncia no formato do guia: sílabas separadas por hífen e a sílaba forte em MAIÚSCULA, como DON-de KE-da.
Se a pergunta não for sobre a viagem ao Uruguai, responda com gentileza que você é um guia de viagem.`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const resposta = (corpo: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const texto = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

async function podePerguntar(aparelho: string, chaveDoSite: string | null): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  // A chave publicável que o site envia serve para chamar a função de limite.
  const chave = Deno.env.get("SUPABASE_ANON_KEY") || chaveDoSite;
  if (!url || !chave) return false;
  const r = await fetch(`${url}/rest/v1/rpc/guia_consumir`, {
    method: "POST",
    headers: { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_aparelho: aparelho }),
  });
  return r.ok && (await r.json()) === true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return resposta({ erro: "Método não permitido" }, 405);

  const chaveGemini = Deno.env.get("GEMINI_API_KEY");
  if (!chaveGemini) return resposta({ erro: "O guia ainda não foi configurado." }, 503);

  let dados: Record<string, unknown>;
  try {
    dados = await req.json();
  } catch {
    return resposta({ erro: "Pedido inválido." }, 400);
  }
  const pergunta = texto(dados.pergunta, 500).trim();
  const contexto = texto(dados.contexto, 12000);
  const aparelho = texto(dados.aparelho, 64);
  if (!pergunta) return resposta({ erro: "Escreva uma pergunta." }, 400);

  if (!(await podePerguntar(aparelho, req.headers.get("apikey")))) {
    return resposta({ erro: "Limite de perguntas de hoje atingido. Tente amanhã." }, 429);
  }

  // Só as últimas trocas, curtas, para manter o pedido pequeno.
  const historico = Array.isArray(dados.historico) ? dados.historico.slice(-6) : [];
  const contents = [
    ...historico
      .filter((m: Record<string, unknown>) => (m?.papel === "user" || m?.papel === "model") && typeof m?.texto === "string")
      .map((m: Record<string, unknown>) => ({ role: m.papel, parts: [{ text: texto(m.texto, 1500) }] })),
    { role: "user", parts: [{ text: `CONTEXTO DO GUIA:\n${contexto}\n\nPERGUNTA:\n${pergunta}` }] },
  ];

  // Tenta os modelos em ordem: se um não existir ou estiver sem cota, passa ao próximo.
  for (const modelo of MODELOS) {
    // Um modelo que demora demais não pode travar a conversa: desiste e tenta o próximo.
    let r: Response;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
        method: "POST",
        signal: AbortSignal.timeout(25000),
        headers: { "x-goog-api-key": chaveGemini, "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: INSTRUCOES }] },
          contents,
          // O limite também conta o raciocínio interno do modelo; com pouco espaço a resposta sai cortada.
          generationConfig: { maxOutputTokens: 4096 },
        }),
      });
    } catch {
      console.log(`Gemini ${modelo}: sem resposta a tempo`);
      continue;
    }
    if (r.ok) {
      const j = await r.json();
      const partes = j?.candidates?.[0]?.content?.parts ?? [];
      const saida = partes.map((p: Record<string, unknown>) => (typeof p?.text === "string" && !p?.thought ? p.text : "")).join("").trim();
      if (saida) return resposta({ resposta: saida, modelo });
      continue;
    }
    if (![400, 403, 404, 429, 500, 503].includes(r.status)) break;
    console.log(`Gemini ${modelo}: ${r.status} ${(await r.text()).slice(0, 300)}`);
  }
  return resposta({ erro: "O guia não conseguiu responder agora. Tente de novo em instantes." }, 502);
});
