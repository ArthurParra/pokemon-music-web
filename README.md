# Pokémon Music Web

Frontend SPA para catalogar as músicas dos jogos de Pokémon. A interface consome a **Pokémon Music API** (desenvolvida na AT1) e realiza o CRUD completo, com feedback visual de carregamento, estado vazio e notificações (toasts).

**Tecnologias:** React, TypeScript, Vite, React Router DOM, Tailwind CSS e shadcn/ui (Sonner para os toasts).

## Funcionalidades

- Dashboard com métricas (total de músicas, jogos diferentes e duração total) e tabela de músicas
- Cadastro e edição de músicas em janela modal (Dialog) com formulário controlado e validação
- Exclusão com janela de confirmação
- Estados de carregamento (skeleton), vazio e erro de comunicação
- Toasts de sucesso e de erro em todas as operações

| Operação | Método | Rota da API    |
| -------- | ------ | -------------- |
| Listar   | GET    | `/musicas`     |
| Criar    | POST   | `/musicas`     |
| Atualizar | PUT   | `/musicas/:id` |
| Excluir  | DELETE | `/musicas/:id` |

## Pré-requisitos

- Node.js 22+ e [pnpm](https://pnpm.io)
- A **Pokémon Music API** em execução (por padrão em `http://localhost:3000`). Consulte o README do repositório da API para subi-la (`pnpm dev` ou `docker compose up -d`).

## Instalação e execução

```bash
pnpm install
cp .env.example .env   # ajuste a URL da API, se necessário
pnpm dev
```

A aplicação ficará disponível em http://localhost:5173.

### Variáveis de ambiente

| Variável       | Descrição                    | Exemplo                 |
| -------------- | ---------------------------- | ----------------------- |
| `VITE_API_URL` | URL base da API REST         | `http://localhost:3000` |

### Scripts

| Script         | Função                                   |
| -------------- | ---------------------------------------- |
| `pnpm dev`     | Servidor de desenvolvimento              |
| `pnpm build`   | Checagem de tipos e build de produção    |
| `pnpm lint`    | Análise estática com ESLint              |
| `pnpm preview` | Pré-visualiza o build de produção        |

## Estrutura do projeto

```
src/
├── components/
│   ├── ui/                  # Componentes do shadcn/ui
│   ├── AppLayout.tsx        # Layout compartilhado (barra superior + navegação)
│   ├── StatsCards.tsx       # Métricas do dashboard
│   ├── MusicTable.tsx       # Tabela, loading, estado vazio e erro
│   ├── MusicFormDialog.tsx  # Modal de cadastro/edição
│   └── DeleteMusicDialog.tsx
├── lib/                     # Utilitários (utils do shadcn e formatação)
├── pages/                   # Dashboard, Sobre e 404
├── services/                # Cliente HTTP da API (fetch)
├── types/                   # Interfaces TypeScript da entidade
├── App.tsx                  # Rotas e <Toaster />
└── main.tsx
```
