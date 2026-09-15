# Configuração no GitHub (feita uma vez, por quem for dono do repositório)

Isso aqui não dá pra deixar pronto em arquivo — são configurações do próprio
GitHub, feitas pela interface web, por quem tiver permissão de admin no
repositório.

## 1. Criar o repositório

No GitHub: **New repository** → nome `gestor-tarefas-devops` → **não** marque
"Add a README" (já existe um aqui) → criar.

Depois, na pasta do projeto:

```bash
git remote add origin https://github.com/SEU-USUARIO/gestor-tarefas-devops.git
git push -u origin main
git push origin feature/update-task
```

## 2. Proteger a branch `main`

**Settings → Branches → Add branch protection rule**

- Branch name pattern: `main`
- Marque:
  - ✅ **Require a pull request before merging**
    - ✅ Require approvals (mínimo 1)
  - ✅ **Require status checks to pass before merging**
    - Marque o check `test` (e `docker`, se quiser exigir o build da imagem
      também) — eles só aparecem na lista depois que o workflow rodar pelo
      menos uma vez, então faça isso depois do primeiro push/PR.
  - ✅ **Do not allow bypassing the above settings** (nem admin builda direto)
- Salve.

A partir daqui, ninguém — nem o dono do repositório — consegue dar push
direto na `main`; toda mudança precisa passar por Pull Request com o CI
verde.

## 3. Convidar o resto do grupo

**Settings → Collaborators and teams → Add people** — adicione seus colegas
com permissão de **Write** (para poderem criar branches e abrir PRs).

## 4. Como seu amigo abre o Pull Request da parte em aberto

A branch `feature/update-task` já está criada e enviada (passo 1). Seu amigo
só precisa:

```bash
git clone https://github.com/SEU-USUARIO/gestor-tarefas-devops.git
cd gestor-tarefas-devops
git checkout feature/update-task
```

Implementar o que está descrito em `docs/TAREFA_ABERTA.md`, commitar, dar
`git push`, e no GitHub vai aparecer o botão **Compare & pull request**
direto na página do repositório. Ele abre o PR de `feature/update-task` para
`main`, o pipeline de CI roda sozinho, e com 1 aprovação (sua, por exemplo)
o PR pode ser mergeado.
