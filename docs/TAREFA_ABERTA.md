# Tarefa em aberto: atualizar uma tarefa (PUT /api/tasks/:id)

Esta é a funcionalidade deixada de propósito para outra pessoa do grupo implementar
e abrir um Pull Request. Está tudo preparado: a rota já existe (só devolve `501` por
enquanto), há uma branch pronta pra começar, e os testes que precisam passar já estão
escritos.

## Onde mexer

1. **`src/db.js`** — função `updateTask(id, changes)`:
   - Hoje ela só lança um erro. Precisa: montar um `UPDATE` no SQLite que atualize
     `title` e/ou `done` (o que for enviado), e retornar a tarefa atualizada (pode
     reaproveitar `getTask(id)` no final).
   - Se o `id` não existir, retorne `null` (ou `undefined`) em vez de lançar erro —
     quem chama decide o que fazer com isso.

2. **`src/routes/tasks.js`** — rota `router.put("/:id", ...)`:
   - Hoje só devolve `501`. Precisa: ler `title` e/ou `done` do corpo da requisição,
     validar que pelo menos um dos dois foi enviado (senão, `400`), chamar
     `db.updateTask(...)`, e devolver `404` se a tarefa não existir ou `200` com a
     tarefa atualizada se der certo.

## Critérios de aceite (o que os testes vão cobrar)

Abra `tests/tasks.update.test.js`. Os três `test.todo(...)` descrevem exatamente o
que precisa funcionar:

1. Atualizar título e/ou `done` de uma tarefa existente → `200` com a tarefa atualizada
2. Atualizar uma tarefa que não existe → `404`
3. Corpo da requisição sem nenhum campo válido (`title` ou `done`) → `400`

Para implementar: troque cada `test.todo("descrição")` por um `test("descrição", async () => { ... })`
de verdade (siga o padrão dos outros arquivos em `tests/`, como `tasks.create.test.js`).
Depois que os três estiverem passando, **apague** o teste
`"hoje a rota ainda responde 501"` no fim do arquivo — ele só existe pra documentar o
estado atual (ainda não implementado).

## Como começar

```bash
git fetch origin
git checkout feature/update-task
npm install
npm test   # os 3 test.todo vão aparecer como pendentes, isso é esperado agora
```

Depois de implementar e os testes passarem, abra um Pull Request de
`feature/update-task` para `main`. O pipeline de CI vai rodar sozinho e precisa
ficar verde antes do merge.

## Dica de commit

Sugestão de mensagem, seguindo o padrão do projeto (ver `CONTRIBUTING.md`):

```
feat(tasks): implementa atualização de tarefa (PUT /api/tasks/:id)
```
