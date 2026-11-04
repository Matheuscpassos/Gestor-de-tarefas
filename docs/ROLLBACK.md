# Rollback — procedimento e simulação documentada (A2)

## Como o rollback funciona neste projeto

Toda versão publicada fica guardada no GitHub Container Registry (GHCR) com uma
tag imutável: `1.0.0`, `1.1.0`, … (releases) e `sha-<commit>` (cada merge na
`main`). Voltar atrás significa **reimplantar uma tag anterior** — sem rebuild,
sem mexer no código:

1. Actions → workflow **Rollback** → **Run workflow**
2. Informar a versão estável anterior (ex.: `1.0.0`)
3. O workflow faz `docker compose pull` da tag, sobe a stack em `staging` e roda o
   smoke test **conferindo que `/health` retorna a versão restaurada**.

Depois do rollback, corrigir o problema numa branch (`fix/...`), abrir PR e
lançar um `PATCH` (ex.: `1.1.1`).

Rollback local equivalente (docker compose):

```bash
IMAGE_TAG=1.0.0 docker compose up -d --no-build
bash scripts/smoke-test.sh http://localhost:3000 1.0.0
```

## Simulação (roteiro para reproduzir e gerar evidências)

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 1 | Garantir `v1.0.0` publicada e em staging (`/health` → `"version":"1.0.0"`) | versão estável no ar |
| 2 | Branch `fix/simulacao-falha`: em `src/public/script.js`, trocar `fetch("/api/tasks")` (linha de listagem) por `fetch("/api/task")` — um bug de interface que os testes de backend **não** pegam | PR com CI verde |
| 3 | Merge via PR, depois `git tag -a v1.1.0 -m "Release 1.1.0" && git push origin v1.1.0` | imagem `1.1.0` publicada + deploy em staging |
| 4 | Abrir a aplicação de `1.1.0`: a lista de tarefas não carrega → **incidente simulado** | falha identificada |
| 5 | Actions → **Rollback** → versão `1.0.0` | job verde; smoke test confirma `1.0.0` |
| 6 | Correção definitiva (reverter o `fetch`) → PR → tag `v1.1.1` | nova versão estável |

### Evidências a anexar (prints/links)

- [ ] Execução do workflow **CI/CD** da tag `v1.0.0` (jobs verdes)
- [ ] Página **Packages** do GHCR mostrando as tags `1.0.0` e `1.1.0`
- [ ] Execução do deploy da `v1.1.0` + `/health` com `"version":"1.1.0"`
- [ ] Print do defeito (lista vazia) na `1.1.0`
- [ ] Execução do workflow **Rollback** (versão `1.0.0`) com o resumo "Rollback concluído"
- [ ] `/health` voltando a `"version":"1.0.0"`
- [ ] Página **Releases** com `v1.0.0`, `v1.1.0` e `v1.1.1`

### Registro da simulação (preencher)

| Item | Valor |
|------|-------|
| Data/hora do deploy da v1.1.0 | |
| Data/hora do rollback | |
| Tempo até restaurar (RTO simulado) | |
| Link do run do Rollback | |
| Causa raiz e correção | |
