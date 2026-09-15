# Conteinerização inicial do Gestor de Tarefas (Marco 1 — Integração DevOps, CEUB)
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia primeiro só os manifestos para aproveitar o cache de camadas do
# Docker — a reinstalação de dependências só roda de novo se o
# package.json/package-lock.json mudarem.
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
