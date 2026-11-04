# Dockerfile do Gestor de Tarefas (A2 — Integração DevOps, CEUB)
#
# Otimizações aplicadas:
#  - multi-stage: o estágio "deps" instala só as dependências de produção;
#    a imagem final não carrega cache do npm nem devDependencies (Jest etc.)
#  - ordem das camadas pensada para cache: package*.json antes do código
#  - imagem base alpine (pequena) com versão fixada (node:20-alpine)
#  - roda como usuário não-root ("node")
#  - HEALTHCHECK nativo apontando para /health
#  - versão da imagem exposta via APP_VERSION (usada no rollback/evidências)

# ---------- Estágio 1: dependências de produção ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---------- Estágio 2: imagem final ----------
FROM node:20-alpine AS runtime

ARG APP_VERSION=dev
ENV NODE_ENV=production \
    PORT=3000 \
    DB_PATH=/data/data.sqlite3 \
    APP_VERSION=${APP_VERSION}

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# /data guarda o banco SQLite; é um volume para sobreviver a recriações
# do contêiner. O dono precisa ser o usuário não-root.
RUN mkdir -p /data && chown -R node:node /data /app
USER node
VOLUME ["/data"]

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "src/app.js"]
