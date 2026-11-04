# Rollback — procedimento e simulação documentada (A2)

## Como o rollback funciona neste projeto

Toda versão publicada fica guardada no GitHub Container Registry (GHCR) com uma tag imutável: `1.0.0`, `1.1.0`, … (releases) e `sha-<commit>` (cada merge na `main`). Voltar atrás significa **reimplantar uma tag anterior** — sem rebuild, sem mexer no código:

1. Actions → workflow **Rollback** → **Run workflow**
2. Informar a versão estável anterior (ex.: `1.0.0`)
3. O workflow faz `docker compose pull` da tag, sobe a stack em `staging` e roda o smoke test **conferindo que `/health` retorna a versão restaurada**.

Depois do rollback, corrigir o problema numa branch (`fix/...`), abrir PR e lançar um `PATCH` (ex.: `1.1.2`).

Rollback local equivalente (docker compose):

```
IMAGE_TAG=1.0.0 docker compose up -d --no-build
bash scripts/smoke-test.sh http://localhost:3000 1.0.0
```

## Simulação realizada

| # | Ação | Resultado |
|----|------|-----------|
| 1 | `v1.0.0` publicada e implantada em staging (`/health` → `"version":"1.0.0"`) | versão estável no ar |
| 2 | PR #2 mergeado sem alteração de código e tag `v1.1.0` publicada | `1.1.0` idêntica à `1.0.0`; registrada como está |
| 3 | Branch `fix/simulacao-falha`: em `src/public/script.js` (linha 6), `fetch("/api/tasks")` trocado por `fetch("/api/task")` — bug de interface que os testes de backend **não** pegam | PR com CI verde |
| 4 | Merge via PR e tag `v1.1.1` | imagem `1.1.1` publicada e deploy verde em staging |
| 5 | Abertura da aplicação da `1.1.1`: a lista de tarefas não carrega (a rota `/api/task` não existe) | **incidente simulado** identificado |
| 6 | Actions → **Rollback** → versão `1.0.0` | job verde; resumo "Rollback concluído" com versão restaurada `1.0.0` |
| 7 | Correção definitiva (`fetch` revertido para `/api/tasks`) → PR → tag `v1.1.2` | nova versão estável |

### Tabela de versões

| Versão | Situação |
|--------|----------|
| v1.0.0 | Estável (alvo do rollback) |
| v1.1.0 | Publicada sem alteração de código (PR #2 sem mudanças) |
| v1.1.1 | Defeituosa (`/api/task`), revertida por rollback para a 1.0.0 |
| v1.1.2 | Correção definitiva |

### Evidências anexadas

- [ ] Execução do workflow **CI/CD** da tag `v1.0.0` (jobs verdes)
- [ ] Página **Packages** do GHCR com as tags `1.0.0`, `1.1.0`, `1.1.1` e `1.1.2`
- [ ] Diff do PR com a troca `/api/tasks` → `/api/task` (aba *Files changed*)
- [ ] Execução do deploy da `v1.1.1` (verde, apesar do defeito)
- [ ] Print do defeito (lista vazia) na `1.1.1`
- [ ] Execução do workflow **Rollback** (versão `1.0.0`) com o resumo "Rollback concluído"
- [ ] `/health` voltando a `"version":"1.0.0"`
- [ ] Diff do PR da correção e execução da tag `v1.1.2`
- [ ] Página **Releases** com `v1.0.0`, `v1.1.0`, `v1.1.1` e `v1.1.2`

### Registro da simulação

| Item | Valor |
|------|-------|
| Data/hora do deploy da v1.1.1 | 04/11 8:47 |
| Data/hora do rollback | 04/11 8:49 |
| Tempo até restaurar (RTO simulado) | 13 s |
| Link do run do Rollback | [<preencher>](https://github.com/Matheuscpassos/Gestor-de-tarefas/actions/runs/41823872586) |
| Causa raiz e correção | O endpoint da listagem no front-end foi alterado para `/api/task`, rota inexistente. Os testes de backend e o health check não cobrem essa chamada, então o deploy passou verde. Correção: `fetch` revertido para `/api/tasks` (v1.1.2). |

### Lição aprendida

O health check só prova que o servidor sobe. Para pegar esse tipo de falha, o smoke test deveria chamar também `/api/tasks` e validar a resposta.
