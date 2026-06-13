# 🎨 MangaForge — Plataforma de Criação & Assistência IA para Mangás

MangaForge é uma plataforma web interativa de alto desempenho voltada para criadores de mangás, unindo a precisão das técnicas tradicionais de desenho à flexibilidade das tecnologias web e assistência da inteligência artificial generativa.

Esta documentação foi elaborada para guiar novos desenvolvedores pelo ecossistema técnico do projeto.

---

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando as seguintes tecnologias principais:

1.  **Framework**: [Next.js 14 (App Router)](https://nextjs.org/) — Escolhido pela facilidade no roteamento, suporte a Server Components/API Routes e otimização automatizada de páginas e imagens.
2.  **Biblioteca UI**: [React 18](https://react.dev/) — Com hooks customizados e gerenciamento de estado local reativo.
3.  **Linguagem**: [TypeScript](https://www.typescriptlang.org/) — Tipagem estática em toda a aplicação (API externa, payloads de rede, retornos do canvas e dados do MyAnimeList).
4.  **Estilização**: [TailwindCSS 3](https://tailwindcss.com/) — Junto com CSS Vanilla (`globals.css`) para criar uma identidade visual brutalista baseada na cultura de impressão japonesa (retículas halftone, speedlines e marcas de corte).
5.  **Animações**: [Framer Motion 12](https://www.framer.com/motion/) — Controla transições, rolagem parallax, cascatas de renderização e interações no modal com altíssima performance (60 FPS).
6.  **Gráficos & Métricas**: [Recharts 3](https://recharts.org/) — Biblioteca para exibição de dados de produtividade e engajamento no painel de criadores.
7.  **Serviço de IA**: [Google Generative AI SDK (`@google/generative-ai`)](https://www.npmjs.com/package/@google/generative-ai) — Integração com o modelo **Gemini 1.5 Flash** para feedback anatômico e artístico em tempo real com suporte a streams bidirecionais.

---

## 📂 Estrutura de Diretórios

Abaixo está a disposição estrutural de arquivos no diretório `./src`:

```text
src/
├── app/
│   ├── api/
│   │   ├── mentor/
│   │   │   └── route.ts         # Endpoint POST do AI Sensei (streaming com Gemini 1.5 Flash)
│   │   └── trending/
│   │       └── route.ts         # Endpoint GET dos trending mangás via Jikan API + timeouts
│   ├── dashboard/
│   │   └── mentor/
│   │       └── page.tsx         # Workspace do criador contendo o AI Chat e estatísticas
│   ├── fonts/                   # Arquivos de fontes locais otimizados
│   ├── globals.css              # Variáveis CSS, Grid Backgrounds, Halftones e Speedlines
│   ├── layout.tsx               # Configuração do HTML principal e metadados SEO
│   └── page.tsx                 # Landing Page principal (Landing Page + Demo Sandbox + Cards)
├── components/
│   ├── dashboard/
│   │   ├── AIEditorChat.tsx     # Chat reativo de mentoria com suporte a upload de esboços
│   │   └── CreatorOverview.tsx  # Métricas rápidas e painel bento
│   ├── CTA.tsx                  # Seção de call-to-action
│   ├── CreatorDashboard.tsx     # Gráficos animados (AreaChart & RadialBarChart)
│   ├── DrawingCanvas.tsx        # Canvas interativo com guias, pincéis e renderizador IA
│   ├── FAQ.tsx                  # Acordeão de perguntas frequentes
│   ├── Features.tsx             # Grid com diferenciais do editor MangaForge
│   ├── Footer.tsx               # Rodapé com assinatura
│   ├── Gallery.tsx              # Carrossel/grid estático de artes finais
│   ├── Hero.tsx                 # Cabeçalho da página com simulador interativo de desenho (52 frames)
│   ├── HeroCTA.tsx              # Botão e chamada de destaque secundário
│   ├── Navbar.tsx               # Navegação fixa superior
│   ├── Pricing.tsx              # Tabela de planos e preços
│   ├── ProductDemo.tsx          # Mockup interativo da interface com hotspots brilhantes
│   ├── StickyBar.tsx            # Barra informativa persistente
│   └── Testimonials.tsx         # Feedback de artistas betatesters
└── hooks/
    └── useMangaMentor.ts        # Hook para streaming de chat, buffer Base64 e erros
```

---

## ⚡ Funcionalidades de Destaque no Código

### 1. Engine de Animação de Canvas no Hero (`Hero.tsx`)
O componente Hero implementa um player de animação baseado no elemento `<canvas>`. Ele pré-carrega 52 imagens em cache global de módulo para evitar renderizações desnecessárias e requisições HTTP duplicadas por conta da montagem dupla em ambiente de desenvolvimento. Ao mover o mouse horizontalmente sobre a área, a animação segue o cursor aplicando técnicas de suavização de movimento (*linear interpolation* ou LERP).

### 2. Sandbox de Desenho Interativo com Scanline IA (`DrawingCanvas.tsx`)
Permite ao usuário desenhar em tempo real. O canvas utiliza uma escala de `2x` para suporte a displays Retina de alta resolução e conta com:
*   **Guias autônomos**: Um gerador vetorial desenha no canvas rascunhos em azul de referência de forma animada passo a passo (Retrato, Árvore, Cachorro).
*   **Classificador de Padrões Heurístico**: Analisa os traços do usuário localmente no navegador calculando a relação de aspecto e a dispersão dos pontos (se concentrados na copa de uma árvore ou no corpo de um animal), ativando renderizações correspondentes de forma inteligente.
*   **Efeito Scanline**: Um filtro de renderização dinâmico varre a tela de cima a baixo integrando o rascunho com a arte final correspondente de alta definição através da API de recorte do Canvas 2D (`clip()`).

### 3. API de IA com Resiliência Integrada (`src/app/api/mentor/route.ts`)
Essa rota lida com o feedback do editor virtual "Sensei".
*   **Modo Online**: Utiliza o SDK oficial do Google Generative AI para rodar o modelo `gemini-1.5-flash` com instruções do sistema configuradas para retornar análises estruturadas em tópicos Markdown (1. Anatomia e Pose, 2. Qualidade do Traço, 3. Composição de Painel e Storytelling).
*   **Modo Offline (Simulador)**: Se a chave `GEMINI_API_KEY` não estiver configurada no `.env`, a API chaveia automaticamente para um simulador de streaming assíncrono que escreve palavra por palavra com pausas de `35ms`, fornecendo uma simulação perfeita da experiência de IA para o front-end sem estourar erros.

### 4. Integração Resiliente Jikan/MAL API (`src/app/api/trending/route.ts`)
Busca referências de mangás de sucesso reais do MyAnimeList:
*   Aplica cache de revalidação de 1 hora (`revalidate = 3600`) para não sobrecarregar as requisições na API pública.
*   Usa `AbortController` com limite de 6 segundos para lidar com lentidões ou indisponibilidade de serviço, retornando status HTTP `502` / `504` amigáveis para a interface renderizar estados alternativos.

---

## 🚀 Como Iniciar o Desenvolvimento

### Requisitos
*   [Node.js](https://nodejs.org/) (Versão 18 ou superior recomendado).
*   Gerenciador de pacotes `npm` ou `bun`.

### Instalação
Clone o repositório e instale as dependências:
```bash
npm install
```

### Configuração de Ambiente
Crie um arquivo `.env.local` na raiz do projeto e adicione a chave de API do Gemini para habilitar a inteligência artificial online:
```env
GEMINI_API_KEY=sua_chave_aqui
```

### Executando em Desenvolvimento
Inicie o servidor local:
```bash
npm run dev
```
O servidor estará acessível em [http://localhost:3000](http://localhost:3000).

### Compilando para Produção
Valide os tipos TypeScript e gere os arquivos otimizados finais:
```bash
npm run build
```
Para inicializar os arquivos compilados:
```bash
npm run start
```
