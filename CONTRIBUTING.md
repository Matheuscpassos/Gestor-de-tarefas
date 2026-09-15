# Como contribuir

## Estratégia de branches: Trunk-Based Development

- **`main`** é o tronco (trunk): sempre estável, sempre com CI verde, sempre
  a versão "pronta para rodar".
- Ninguém commita direto na `main`. Todo trabalho acontece em branches
  **curtas**, criadas a partir da `main`:
  ```
  git checkout main
  git pull
  git checkout -b feature/nome-curto-da-tarefa
  ```
- Nome de branch: `feature/...` (funcionalidade nova), `fix/...` (correção),
  `chore/...` (manutenção, config, dependências).
- Branches devem viver **pouco tempo** (idealmente menos de alguns dias).
  Nada de branch que fica semanas sem integrar — isso é o oposto de
  trunk-based e gera conflitos grandes depois.
- Toda mudança entra na `main` por **Pull Request**, nunca por push direto.
  A branch `main` está protegida (ver `docs/CONFIGURACAO_GITHUB.md`) e exige:
  - Pipeline de CI passando (build + testes)
  - Pelo menos 1 aprovação de revisão
- Depois do merge, apague a branch (o próprio GitHub oferece o botão).

## Convenção de commits

Usamos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```
tipo(escopo opcional): descrição curta no imperativo

[corpo opcional explicando o porquê, não o quê]
```

Tipos usados neste projeto:

| Tipo       | Quando usar                                            |
|------------|---------------------------------------------------------|
| `feat`     | uma funcionalidade nova                                 |
| `fix`      | correção de bug                                         |
| `test`     | adicionar ou ajustar testes, sem mudar comportamento    |
| `ci`       | mudanças no pipeline de CI/CD                           |
| `docs`     | documentação (README, docs/, comentários)               |
| `chore`    | tarefas de manutenção (dependências, config, etc.)      |
| `refactor` | mudança interna de código sem alterar comportamento     |

Exemplos:
```
feat(tasks): adiciona endpoint de criação de tarefa
test(tasks): cobre listagem de tarefas vazia e com itens
ci: adiciona job de build da imagem Docker
docs: documenta como rodar o projeto localmente
```

## Papéis do grupo

Conforme pedido no enunciado da disciplina, dividimos o trabalho em três
frentes (uma pessoa pode assumir mais de uma, dependendo do tamanho do
grupo):

- **Desenvolvimento**: implementa funcionalidades em `src/`, corrige bugs.
- **Qualidade**: escreve/mantém os testes em `tests/`, garante cobertura das
  novas funcionalidades antes do merge, revisa Pull Requests com foco em
  casos de borda.
- **Operações / Infraestrutura**: mantém o pipeline de CI
  (`.github/workflows/ci.yml`), o `Dockerfile`, a configuração de proteção
  de branch, e a documentação de como rodar o projeto.

## Rodando localmente antes de abrir um PR

```bash
npm install
npm test
npm run dev   # sobe o servidor em http://localhost:3000
```
