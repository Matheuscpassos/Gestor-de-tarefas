# Gestor de Tarefas — Projeto de Integração DevOps

Projeto da disciplina **Integração DevOps** (Ciência da Computação, CEUB, 2026_2 —
Prof. Danilo Silva), referente à **Avaliação A1 / Marco 1: Integração Contínua (CI) e
Conteinerização Inicial**.

## O que é

Uma aplicação simples de lista de tarefas (API + interface web), pensada para
demonstrar de forma clara os pilares pedidos pelo Marco 1: repositório bem
estruturado, testes automatizados e um pipeline de CI que builda e testa a cada
mudança.

## Requisitos do produto (conforme o enunciado)

| Requisito pedido            | Onde está no projeto                                      |
|------------------------------|-------------------------------------------------------------|
| a. Código-fonte              | `src/` — API em Express (Node.js)                          |
| b. Interface para interação  | `src/public/` — página web que consome a API               |
| c. Banco de dados            | SQLite (`better-sqlite3`), schema em `src/db.js`            |

## Entregas do Marco 1 (A1)

- ✅ **Repositório Git estruturado**: estratégia trunk-based (ver
  `CONTRIBUTING.md`), branch `main` protegida (configuração descrita em
  `docs/CONFIGURACAO_GITHUB.md`), histórico de commits seguindo
  [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
- ✅ **Código-fonte com testes automatizados**: aplicação funcional (`src/`) com
  suíte de testes de integração em `tests/` (Jest + Supertest).
- ✅ **Pipeline de CI operacional**: `.github/workflows/ci.yml`, roda a cada
  push/PR na `main` — instala dependências, roda os testes, e builda a imagem
  Docker.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000 — a interface web já consome a API. O banco SQLite é
criado automaticamente (`data.sqlite3`, ignorado pelo git).

## Rodando os testes

```bash
npm test
```

## Rodando com Docker

```bash
docker build -t gestor-tarefas-devops .
docker run -p 3000:3000 gestor-tarefas-devops
```

## Estrutura do projeto

```
src/
  app.js              ponto de entrada (sobe o servidor)
  server.js           monta o app Express (separado do listen, para os testes)
  db.js               camada de banco de dados (SQLite)
  routes/tasks.js      rotas da API de tarefas
  public/             interface web (HTML/CSS/JS puro)
tests/                 testes de integração (Jest + Supertest)
.github/workflows/     pipeline de CI
docs/                  documentação de apoio (configuração do GitHub, tarefa em aberto)
Dockerfile             conteinerização inicial
```

## API

| Método | Rota              | Descrição                                    |
|--------|-------------------|-----------------------------------------------|
| GET    | `/api/tasks`      | lista todas as tarefas                        |
| POST   | `/api/tasks`      | cria uma tarefa (`{ "title": "..." }`)        |
| DELETE | `/api/tasks/:id`  | remove uma tarefa                             |
| PUT    | `/api/tasks/:id`  | **em aberto** — ver abaixo                    |

## Parte em aberto para contribuição

A atualização de tarefa (`PUT /api/tasks/:id`) foi deixada de propósito como uma
funcionalidade em aberto, pronta para outra pessoa do grupo assumir com um Pull
Request — branch `feature/update-task` já criada, rota e teste já esqueletados.
Veja o passo a passo completo em **[`docs/TAREFA_ABERTA.md`](docs/TAREFA_ABERTA.md)**.

## Papéis do grupo e como contribuir

Ver **[`CONTRIBUTING.md`](CONTRIBUTING.md)** — estratégia de branches, convenção de
commits, e divisão de papéis (Desenvolvimento / Qualidade / Operações-Infraestrutura).

## Publicando no GitHub

Este repositório foi montado localmente. Para publicar na sua conta e configurar a
proteção da branch `main`, siga **[`docs/CONFIGURACAO_GITHUB.md`](docs/CONFIGURACAO_GITHUB.md)**.
