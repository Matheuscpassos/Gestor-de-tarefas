# Gestor de Tarefas — Projeto de Integração DevOps

Projeto da disciplina **Integração DevOps** (Ciência da Computação, CEUB, 2026_2 —
Prof. Danilo Silva).

| Fase | Tema | Status |
|------|------|--------|
| **A1** (09/09/2026) | Integração Contínua (CI) e Conteinerização Inicial | ✅ entregue |
| **A2** (04/11/2026) | Infraestrutura como Código (IaC) e Entrega Contínua (CD) | ✅ implementada (este README) |
| **A3** (09/12/2026) | Pipeline DevSecOps completo e Observabilidade | ⏳ próxima fase |

## O que é

Uma aplicação simples de lista de tarefas (API + interface web), criada para
demonstrar o ciclo DevOps completo: repositório organizado, testes automáticos,
pipeline de CI, imagem Docker, orquestração com Docker Compose, entrega contínua
em um registry com deploy automático em homologação, gestão de segredos,
versionamento semântico e rollback.

## Stack e requisitos do produto

| Requisito do enunciado       | Onde está no projeto                                       |
|------------------------------|------------------------------------------------------------|
| a. Código-fonte              | `src/` — API em Express (Node.js 20)                       |
| b. Interface para interação  | `src/public/` — página web que consome a API               |
| c. Banco de dados            | SQLite (`better-sqlite3`), schema em `src/db.js`           |

## Arquitetura (A2)

```
 dev ──PR──▶ main ──push──▶ GitHub Actions
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
          test (Jest)  ──▶  docker (build + compose + smoke test)
                                            │
                                            ▼
                              publish ──▶ GHCR  ghcr.io/<usuario>/<repo>:<versão>
                                            │
                                            ▼
                         deploy-staging (docker compose, ambiente "staging")
                                            │
                              (tag vX.Y.Z)  ▼
                                      GitHub Release

  Algo deu errado?  Actions ▶ Rollback ▶ informar a versão anterior
```

## Entregas da A1 (Marco 1)

- ✅ **Repositório Git estruturado**: trunk-based (ver `CONTRIBUTING.md`), `main`
  protegida (`docs/CONFIGURACAO_GITHUB.md`), commits no padrão
  [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
- ✅ **Código-fonte com testes automatizados**: Jest + Supertest em `tests/`.
- ✅ **Pipeline de CI**: job `test` roda a cada push/PR na `main`.

## Entregas da A2 (Marco 2)

| Entrega esperada                           | Onde está                                                              |
|--------------------------------------------|------------------------------------------------------------------------|
| **Dockerfile otimizado**                   | `Dockerfile` — multi-stage, usuário não-root, `HEALTHCHECK`, cache de camadas |
| **Orquestração local (Docker Compose)**    | `docker-compose.yml` — app + volume persistente do banco, healthcheck  |
| **Pipeline de CD automatizado**            | `.github/workflows/ci.yml` — jobs `publish` (GHCR) e `deploy-staging`  |
| **Gestão segura de configurações/segredos**| GitHub Secrets (`APP_SECRET`, `GITHUB_TOKEN`), `.env` ignorado pelo git, `.env.example` |
| **Versionamento semântico e rollback**     | tags `vX.Y.Z` → imagem `X.Y.Z` + Release; workflow `rollback.yml`; `docs/ROLLBACK.md` |

## Rodando localmente

### Sem Docker

```bash
npm install
npm run dev
```

Acesse http://localhost:3000. O banco SQLite é criado em `data.sqlite3` (ignorado
pelo git).

### Com Docker Compose (recomendado)

```bash
cp .env.example .env          # ajuste os valores se quiser (o .env não vai pro git)
docker compose up --build -d
bash scripts/smoke-test.sh    # confere /health e exercita a API
```

Acesse http://localhost:3000 e http://localhost:3000/health (mostra status e versão).

```bash
docker compose logs -f        # acompanhar logs
docker compose down           # derruba, mantendo os dados (volume)
docker compose down -v        # derruba e apaga os dados
```

### Só o Dockerfile

```bash
docker build -t gestor-tarefas-devops --build-arg APP_VERSION=1.0.0 .
docker run -p 3000:3000 -v tasks-data:/data gestor-tarefas-devops
```

## Rodando os testes

```bash
npm test
```

## Configurações e segredos

| Variável       | Para quê                                  | Onde é definida                                   |
|----------------|--------------------------------------------|----------------------------------------------------|
| `PORT`         | porta HTTP da aplicação                    | Dockerfile / compose (padrão `3000`)               |
| `DB_PATH`      | caminho do arquivo SQLite                  | compose (`/data/data.sqlite3`, volume persistente) |
| `APP_VERSION`  | versão exibida em `/health`                | injetada no build (`IMAGE_TAG`)                    |
| `APP_ENV`      | ambiente (`local`, `staging`)              | `.env` local / workflow de deploy                  |
| `APP_SECRET`   | segredo de exemplo da aplicação            | `.env` local (ignorado) / **GitHub Secret** no CD  |

Regras: nenhuma senha ou token fica no código-fonte; o `.env` está no `.gitignore`;
o login no GHCR usa o `GITHUB_TOKEN` automático; o segredo `APP_SECRET` é cadastrado
no ambiente `staging` do GitHub. Veja `docs/A2_PASSO_A_PASSO.md`.

## Versionamento e releases

Usamos [Versionamento Semântico](https://semver.org/lang/pt-BR/) (`MAJOR.MINOR.PATCH`):

```bash
git checkout main && git pull
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

O pipeline publica `ghcr.io/<usuario>/<repo>:1.0.0` (e `:1.0`), faz deploy em
staging e cria a GitHub Release. Pushes na `main` publicam `sha-<commit>` e `latest`.

## Rollback

Em caso de falha após um deploy, execute o workflow **Rollback** (aba *Actions*)
informando a versão estável anterior. O procedimento e a simulação documentada
estão em **[`docs/ROLLBACK.md`](docs/ROLLBACK.md)**.

## Estrutura do projeto

```
src/
  app.js              ponto de entrada (sobe o servidor)
  server.js           monta o app Express (separado do listen, para os testes)
  db.js               camada de banco de dados (SQLite)
  routes/tasks.js     rotas da API de tarefas
  public/             interface web (HTML/CSS/JS puro)
tests/                testes de integração (Jest + Supertest)
scripts/smoke-test.sh teste de fumaça usado localmente e no pipeline
.github/workflows/
  ci.yml              CI + CD (testes, build, publicação no GHCR, deploy, release)
  rollback.yml        rollback manual para uma versão anterior
Dockerfile            imagem otimizada (multi-stage, não-root, healthcheck)
docker-compose.yml    orquestração local/homologação
.env.example          modelo das variáveis (sem segredos reais)
docs/                 configuração do GitHub, passo a passo da A2, rollback
```

## API

| Método | Rota              | Descrição                                    |
|--------|-------------------|----------------------------------------------|
| GET    | `/health`         | status e versão em execução                  |
| GET    | `/api/tasks`      | lista todas as tarefas                       |
| POST   | `/api/tasks`      | cria uma tarefa (`{ "title": "..." }`)       |
| DELETE | `/api/tasks/:id`  | remove uma tarefa                            |
| PUT    | `/api/tasks/:id`  | **em aberto** — ver abaixo                   |

## Parte em aberto para contribuição

A atualização de tarefa (`PUT /api/tasks/:id`) segue como funcionalidade em aberto
na branch `feature/update-task` (rota e testes já esqueletados). Passo a passo em
**[`docs/TAREFA_ABERTA.md`](docs/TAREFA_ABERTA.md)**.

## Papéis do grupo e como contribuir

Ver **[`CONTRIBUTING.md`](CONTRIBUTING.md)** — estratégia de branches, convenção de
commits, versionamento e divisão de papéis (Desenvolvimento / Qualidade /
Operações-Infraestrutura).

## Configuração do repositório no GitHub

Proteção da `main`, ambientes e segredos: **[`docs/CONFIGURACAO_GITHUB.md`](docs/CONFIGURACAO_GITHUB.md)**.
