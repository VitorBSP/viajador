// Modelo de país. Formato completo em data/SCHEMA.md.
// 1. Copie para data/<código>.js (ex.: data/ar.js) e troque "xx" abaixo pelo código.
// 2. Preencha os campos e apague os exemplos comentados.
// 3. Rode: python scripts/validar.py
window.VIAJADOR = window.VIAJADOR || { paises: {} };

window.VIAJADOR.paises.xx = {
  codigo: "xx", // 2 letras minúsculas, igual ao nome do arquivo
  nome: "", // em português
  bandeira: "", // emoji
  voz: ["es-419", "es-ES", "es"], // ponha o idioma local primeiro (ex.: "es-AR")
  cidades: [], // devem bater com lugares[].cidade
  intro: "", // uma ou duas frases sobre o espanhol local

  // Pelo menos uma situação, cada uma com pelo menos uma frase.
  // Frase: es, pt e pr obrigatórios (pr com a tônica em MAIÚSCULA); dica opcional.
  situacoes: [
    // {
    //   id: "basico", // a-z, 0-9 e "-"; único no país
    //   icone: "👋",
    //   titulo: "Básico",
    //   frases: [
    //     { es: "¿Dónde está el baño?", pt: "Onde fica o banheiro?", pr: "DON-de es-TÁ el BA-nho?", dica: "Opcional." },
    //   ],
    // },
  ],

  // Use ex ou dica; se houver os dois, o app mostra só ex.
  girias: [
    // { es: "", pt: "", pr: "", ex: "" },
  ],

  ditados: [
    // { es: "", pt: "", uso: "" },
  ],

  // errado: o que o brasileiro acha que significa. Começar pt com ⚠️ destaca como alerta.
  falsosAmigos: [
    // { es: "", pt: "", errado: "" },
  ],

  pronuncia: [
    // { regra: "", ex: "", dica: "Opcional." },
  ],

  // pedir: a frase pronta para pedir o prato, em espanhol.
  comidas: [
    // { nome: "", desc: "", pedir: "" },
  ],

  lugares: [
    // {
    //   cidade: "",
    //   itens: [
    //     {
    //       nome: "",
    //       icone: "",
    //       dica: "",
    //       frases: [
    //         { es: "", pt: "", pr: "" },
    //       ],
    //     },
    //   ],
    // },
  ],
};
