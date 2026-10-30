#!/usr/bin/env python3
"""Valida os arquivos de país do Viajador (formato em data/SCHEMA.md).

Uso:
  python scripts/validar.py                 valida data/*.js (ignora os que começam com _)
  python scripts/validar.py data/uy.js      valida só os arquivos indicados

Saída: 0 = sem erros (avisos não reprovam) · 1 = há erros.
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# Campos de cada tipo de item: True = obrigatório, False = opcional.
FRASE = {"es": True, "pt": True, "pr": True, "dica": False}
SITUACAO = {"id": True, "icone": True, "titulo": True, "frases": True}
GIRIA = {"es": True, "pt": True, "pr": True, "ex": False, "dica": False}
DITADO = {"es": True, "pt": True, "uso": True}
FALSO_AMIGO = {"es": True, "pt": True, "errado": True}
REGRA = {"regra": True, "ex": True, "dica": False}
COMIDA = {"nome": True, "desc": True, "pedir": True}
CIDADE = {"cidade": True, "itens": True}
LUGAR = {"nome": True, "icone": True, "dica": True, "frases": True}
PAIS = {
    "codigo": True, "nome": True, "bandeira": True, "voz": True, "cidades": True, "intro": True,
    "situacoes": True, "girias": True, "ditados": True, "falsosAmigos": True,
    "pronuncia": True, "comidas": True, "lugares": True,
    "conversas": False, "etiqueta": False, "checklist": False, "guia": False,
}
GUIA = {"id": True, "lugar": True, "coords": True, "revisado": True, "resumo": True, "historia": True, "reparar": True, "fontes": True}
FONTE = {"titulo": True, "url": True}
CONVERSA = {"id": True, "icone": True, "titulo": True, "passos": True}
PASSO = {"titulo": True, "es": True}
ETIQUETA = {"titulo": True, "texto": True}
CHECK = {"id": True, "texto": True, "nota": False}


class ErroDeLeitura(Exception):
    pass


class Obj(dict):
    linha = 0


def linha_de(texto, pos):
    return texto.count("\n", 0, pos) + 1


def sem_comentarios(texto):
    """Troca comentários por espaços, mantendo as posições e as quebras de linha."""
    saida = list(texto)
    i, n = 0, len(texto)
    while i < n:
        c = texto[i]
        if c in "\"'`":
            i += 1
            while i < n and texto[i] != c:
                i += 2 if texto[i] == "\\" else 1
            i += 1
        elif texto.startswith("//", i) or texto.startswith("/*", i):
            fim_txt = "\n" if texto[i + 1] == "/" else "*/"
            fim = texto.find(fim_txt, i + 2)
            fim = n if fim < 0 else fim + (0 if fim_txt == "\n" else 2)
            for j in range(i, fim):
                if saida[j] != "\n":
                    saida[j] = " "
            i = fim
        else:
            i += 1
    return "".join(saida)


class Leitor:
    """Lê um literal de objeto JS: só dados, sem expressões nem código."""

    ESCAPES = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f", "v": "\v", "0": "\0"}

    def __init__(self, texto, pos):
        self.t = texto
        self.i = pos

    def falha(self, msg):
        raise ErroDeLeitura(f"linha {linha_de(self.t, self.i)}: {msg}")

    def pula(self):
        while self.i < len(self.t) and self.t[self.i].isspace():
            self.i += 1

    def atual(self):
        self.pula()
        return self.t[self.i] if self.i < len(self.t) else ""

    def valor(self):
        c = self.atual()
        if c == "{":
            return self.objeto()
        if c == "[":
            return self.lista()
        if c in ("'", '"'):
            return self.texto()
        m = re.compile(r"-?\d+(\.\d+)?|true\b|false\b|null\b").match(self.t, self.i)
        if m:
            self.i = m.end()
            return json.loads(m.group())
        self.falha(f"valor não permitido (só literais de dados): {self.t[self.i:self.i + 20]!r}")

    def objeto(self):
        o = Obj()
        o.linha = linha_de(self.t, self.i)
        self.i += 1
        while self.atual() != "}":
            if self.atual() in ("'", '"'):
                chave = self.texto()
            else:
                m = re.compile(r"[A-Za-z_$][\w$]*").match(self.t, self.i)
                if not m:
                    self.falha("esperava o nome de um campo")
                chave = m.group()
                self.i = m.end()
            if chave in o:
                self.falha(f'campo "{chave}" repetido no mesmo objeto')
            if self.atual() != ":":
                self.falha(f'esperava ":" depois de "{chave}"')
            self.i += 1
            o[chave] = self.valor()
            if self.atual() == ",":
                self.i += 1
            elif self.atual() != "}":
                self.falha('esperava "," ou "}"')
        self.i += 1
        return o

    def lista(self):
        itens = []
        self.i += 1
        while self.atual() != "]":
            itens.append(self.valor())
            if self.atual() == ",":
                self.i += 1
            elif self.atual() != "]":
                self.falha('esperava "," ou "]"')
        self.i += 1
        return itens

    def texto(self):
        aspas = self.t[self.i]
        self.i += 1
        partes = []
        while True:
            if self.i >= len(self.t) or self.t[self.i] == "\n":
                self.falha("texto sem aspas de fechamento")
            c = self.t[self.i]
            self.i += 1
            if c == aspas:
                return "".join(partes)
            if c != "\\":
                partes.append(c)
                continue
            e = self.t[self.i]
            self.i += 1
            if e == "u":
                m = re.compile(r"\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{4})").match(self.t, self.i)
                if not m:
                    self.falha("escape \\u inválido")
                partes.append(chr(int(m.group(1) or m.group(2), 16)))
                self.i = m.end()
            else:
                partes.append(self.ESCAPES.get(e, e))


def carregar(caminho):
    """Devolve [(chave, objeto)] com cada país registrado no arquivo."""
    texto = sem_comentarios(caminho.read_text(encoding="utf-8-sig"))
    achados = re.finditer(r"window\.VIAJADOR\.paises(?:\.(\w+)|\[[\"'](\w+)[\"']\])\s*=\s*", texto)
    paises = []
    for m in achados:
        leitor = Leitor(texto, m.end())
        if leitor.atual() != "{":
            leitor.falha("o país precisa ser um objeto { ... }")
        paises.append((m.group(1) or m.group(2), leitor.valor()))
    return paises


class Relatorio:
    def __init__(self, nome):
        self.nome = nome
        self.erros = []
        self.avisos = []

    def erro(self, linha, onde, msg):
        self.erros.append((linha, onde, msg))

    def aviso(self, linha, onde, msg):
        self.avisos.append((linha, onde, msg))

    def imprimir(self):
        for rotulo, itens in (("ERRO", self.erros), ("AVISO", self.avisos)):
            for linha, onde, msg in sorted(itens, key=lambda x: x[0]):
                print(f"{self.nome}:{linha}: {rotulo} {onde}: {msg}")


def checar_campos(r, obj, spec, onde, linha_pai=0):
    """Confere tipos e campos de um item; devolve False se nem objeto ele é."""
    if not isinstance(obj, Obj):
        r.erro(linha_pai, onde, "deveria ser um objeto { ... }")
        return False
    for campo, obrigatorio in spec.items():
        if campo not in obj:
            if obrigatorio:
                r.erro(obj.linha, onde, f'falta o campo obrigatório "{campo}"')
        elif not isinstance(obj[campo], (str, list)):
            r.erro(obj.linha, onde, f'"{campo}" tem tipo errado')
        elif isinstance(obj[campo], str) and not obj[campo].strip():
            r.erro(obj.linha, onde, f'"{campo}" está vazio')
    for campo in obj:
        if campo not in spec:
            r.aviso(obj.linha, onde, f'campo desconhecido "{campo}" (o app ignora; erro de digitação?)')
    return True


def lista_de(r, pai, campo, onde, minimo=0):
    """Devolve o campo como lista, avisando se estiver vazio ou com tipo errado."""
    valor = pai.get(campo)
    if campo not in pai:
        return []
    if not isinstance(valor, list):
        r.erro(pai.linha, onde, f'"{campo}" deveria ser uma lista [ ... ]')
        return []
    if len(valor) < minimo:
        r.erro(pai.linha, onde, f'"{campo}" precisa de pelo menos {minimo} item(ns)')
    return valor


def checar_unicos(r, itens, campo, onde):
    vistos = {}
    for item in itens:
        if not isinstance(item, Obj) or not isinstance(item.get(campo), str):
            continue
        valor = item[campo]
        if valor in vistos:
            r.erro(item.linha, onde, f'{campo} repetido "{valor}" (já aparece na linha {vistos[valor]})')
        else:
            vistos[valor] = item.linha


def checar_pronuncia(r, item, onde):
    es, pr = item.get("es"), item.get("pr")
    if not (isinstance(es, str) and isinstance(pr, str) and pr.strip()):
        return
    if pr == pr.lower():
        r.aviso(item.linha, onde, f'pronúncia sem sílaba tônica em MAIÚSCULA: "{pr}"')
    if es.count("/") != pr.count("/"):
        r.aviso(item.linha, onde, f'"es" e "pr" têm número diferente de opções com "/": "{es}" x "{pr}"')
    elif not re.search(r"\d", es):
        palavras_es = [p for p in es.split() if re.search(r"\w", p)]
        palavras_pr = [p for p in pr.split() if re.search(r"\w", p)]
        if len(palavras_es) != len(palavras_pr):
            r.aviso(item.linha, onde, f'"es" e "pr" têm número diferente de palavras: "{es}" x "{pr}"')


def checar_frases(r, dono, onde):
    frases = lista_de(r, dono, "frases", onde, minimo=1)
    for n, f in enumerate(frases):
        lugar = f"{onde}.frases[{n}]"
        if checar_campos(r, f, FRASE, lugar, dono.linha):
            checar_pronuncia(r, f, lugar)
    return [f for f in frases if isinstance(f, Obj)]


def checar_pais(r, chave, p, esperado):
    if not isinstance(p, Obj):
        r.erro(0, "país", "deveria ser um objeto")
        return
    checar_campos(r, p, PAIS, "país")

    codigo = p.get("codigo")
    if not (isinstance(codigo, str) and re.fullmatch(r"[a-z]{2}", codigo)):
        r.erro(p.linha, "codigo", f"deveria ter 2 letras minúsculas (ISO 3166), veio {codigo!r}")
    if chave != codigo:
        r.erro(p.linha, "codigo", f'registrado como paises.{chave}, mas codigo é "{codigo}"')
    if chave != esperado:
        r.erro(p.linha, "codigo", f'o arquivo deveria se chamar data/{chave}.js')
    if not lista_de(r, p, "voz", "voz", minimo=1) or any(not isinstance(v, str) for v in p.get("voz", [])):
        r.erro(p.linha, "voz", "deveria listar códigos de idioma (texto), do mais específico ao geral")

    situacoes = lista_de(r, p, "situacoes", "situacoes", minimo=1)
    checar_unicos(r, situacoes, "id", "situacoes")
    frases = []
    for n, s in enumerate(situacoes):
        rotulo = s.get("id", n) if isinstance(s, Obj) else n
        onde = f"situacoes[{rotulo}]"
        if checar_campos(r, s, SITUACAO, onde, p.linha):
            if isinstance(s.get("id"), str) and not re.fullmatch(r"[a-z0-9-]+", s["id"]):
                r.erro(s.linha, onde, 'id só pode ter a-z, 0-9 e "-" (vai na URL)')
            frases += checar_frases(r, s, onde)

    secoes = (("girias", GIRIA, "es"), ("ditados", DITADO, "es"), ("falsosAmigos", FALSO_AMIGO, "es"),
              ("pronuncia", REGRA, "regra"), ("comidas", COMIDA, "nome"))
    for nome, spec, chave_unica in secoes:
        itens = lista_de(r, p, nome, nome)
        if nome in p and not itens:
            r.aviso(p.linha, nome, "seção vazia: a tela correspondente fica em branco")
        checar_unicos(r, itens, chave_unica, nome)
        for n, item in enumerate(itens):
            onde = f"{nome}[{n}]"
            if checar_campos(r, item, spec, onde, p.linha) and nome == "girias":
                checar_pronuncia(r, item, onde)
                if not item.get("ex") and not item.get("dica"):
                    r.aviso(item.linha, onde, 'sem "ex" nem "dica": o cartão fica sem exemplo')

    cidades = lista_de(r, p, "lugares", "lugares")
    if "lugares" in p and not cidades:
        r.aviso(p.linha, "lugares", "seção vazia: a tela correspondente fica em branco")
    checar_unicos(r, cidades, "cidade", "lugares")
    for n, c in enumerate(cidades):
        rotulo = c.get("cidade", n) if isinstance(c, Obj) else n
        onde = f"lugares[{rotulo}]"
        if not checar_campos(r, c, CIDADE, onde, p.linha):
            continue
        itens = lista_de(r, c, "itens", onde, minimo=1)
        checar_unicos(r, itens, "nome", onde)
        for m, lugar in enumerate(itens):
            lugar_onde = f"{onde}.itens[{m}]"
            if checar_campos(r, lugar, LUGAR, lugar_onde, c.linha):
                frases += checar_frases(r, lugar, lugar_onde)

    declaradas = {c for c in lista_de(r, p, "cidades", "cidades") if isinstance(c, str)}
    com_lugares = {c["cidade"] for c in cidades if isinstance(c, Obj) and isinstance(c.get("cidade"), str)}
    for nome in sorted(declaradas ^ com_lugares):
        lado = '"cidades"' if nome in declaradas else '"lugares"'
        r.aviso(p.linha, "cidades", f'"{nome}" aparece só em {lado}')

    # Os favoritos guardam o texto em espanhol: frases iguais viram um favorito só.
    vistas = {}
    pedidos = [c for c in p.get("comidas", []) if isinstance(c, Obj)] if isinstance(p.get("comidas"), list) else []
    for linha, es in [(f.linha, f.get("es")) for f in frases] + [(c.linha, c.get("pedir")) for c in pedidos]:
        if not isinstance(es, str):
            continue
        if es in vistas:
            r.aviso(linha, "frases", f'"{es}" repetida (linha {vistas[es]}): favoritar uma marca as duas')
        else:
            vistas[es] = linha

    # Conversas citam frases pelo texto de `es`: uma citação errada sumiria da tela.
    conversas = lista_de(r, p, "conversas", "conversas")
    checar_unicos(r, conversas, "id", "conversas")
    for n, c in enumerate(conversas):
        onde = f"conversas[{n}]"
        if not checar_campos(r, c, CONVERSA, onde, p.linha):
            continue
        for m, passo in enumerate(lista_de(r, c, "passos", onde, minimo=1)):
            lugar = f"{onde}.passos[{m}]"
            if checar_campos(r, passo, PASSO, lugar, c.linha):
                for es in lista_de(r, passo, "es", lugar, minimo=1):
                    if es not in vistas:
                        r.erro(passo.linha, lugar, f'frase citada não existe: "{es}"')
    # Guia: cada ponto aponta para um lugar existente e precisa de fonte para a história.
    guia = lista_de(r, p, "guia", "guia")
    checar_unicos(r, guia, "id", "guia")
    nomes = {l.get("nome") for c in lista_de(r, p, "lugares", "lugares") if isinstance(c, Obj)
             for l in lista_de(r, c, "itens", "lugares") if isinstance(l, Obj)}
    for n, g in enumerate(guia):
        onde = f"guia[{n}]"
        if not checar_campos(r, g, GUIA, onde, p.linha):
            continue
        if g.get("lugar") not in nomes:
            r.erro(g.linha, onde, f'lugar não existe em "lugares": "{g.get("lugar")}"')
        xy = g.get("coords")
        if not (isinstance(xy, list) and len(xy) == 2 and -90 <= xy[0] <= 90 and -180 <= xy[1] <= 180):
            r.erro(g.linha, onde, "coords deveria ser [latitude, longitude]")
        lista_de(r, g, "historia", onde, minimo=1)
        for m, f in enumerate(lista_de(r, g, "fontes", onde, minimo=1)):
            if checar_campos(r, f, FONTE, f"{onde}.fontes[{m}]", g.linha) and not str(f.get("url")).startswith("https://"):
                r.erro(f.linha, f"{onde}.fontes[{m}]", "url deveria começar com https://")
    for n, e in enumerate(lista_de(r, p, "etiqueta", "etiqueta")):
        checar_campos(r, e, ETIQUETA, f"etiqueta[{n}]", p.linha)
    itens = lista_de(r, p, "checklist", "checklist")
    checar_unicos(r, itens, "id", "checklist")
    for n, i in enumerate(itens):
        checar_campos(r, i, CHECK, f"checklist[{n}]", p.linha)


def validar(caminho):
    try:
        nome = caminho.resolve().relative_to(RAIZ).as_posix()
    except ValueError:
        nome = str(caminho)
    r = Relatorio(nome)
    try:
        paises = carregar(caminho)
    except (ErroDeLeitura, OSError, UnicodeDecodeError) as e:
        r.erro(0, "leitura", str(e))
        return r
    if not paises:
        r.erro(0, "leitura", "nenhum window.VIAJADOR.paises.<código> = { ... } encontrado")
    for chave, obj in paises:
        checar_pais(r, chave, obj, caminho.stem)
    return r


def main(args):
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    arquivos = [Path(a) for a in args] or sorted(
        a for a in (RAIZ / "data").glob("*.js") if not a.name.startswith("_")
    )
    if not arquivos:
        print("Nenhum arquivo de país encontrado.")
        return 1
    total_erros = 0
    for arquivo in arquivos:
        r = validar(arquivo)
        r.imprimir()
        print(f"{r.nome}: {len(r.erros)} erro(s), {len(r.avisos)} aviso(s)")
        total_erros += len(r.erros)
    return 1 if total_erros else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
