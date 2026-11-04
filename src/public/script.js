const form = document.getElementById("task-form");
const input = document.getElementById("task-title");
const list = document.getElementById("task-list");

async function loadTasks() {
  const res = await fetch("/api/task");
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  list.innerHTML = "";

  if (tasks.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "Nenhuma tarefa ainda. Adicione a primeira acima.";
    list.appendChild(li);
    return;
  }

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.textContent = task.title;

    const editBtn = document.createElement("button");
    editBtn.className = "secondary";
    editBtn.textContent = "editar";
    // A edição ainda não foi implementada no backend (PUT /api/tasks/:id
    // devolve 501 hoje) — ver docs/TAREFA_ABERTA.md. O botão já existe na
    // interface para deixar claro onde a funcionalidade vai aparecer assim
    // que a rota for concluída.
    editBtn.onclick = async () => {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: prompt("Novo título:", task.title) }),
      });
      if (res.status === 501) {
        alert("Editar tarefas ainda não foi implementado neste projeto — ver docs/TAREFA_ABERTA.md.");
        return;
      }
      loadTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "danger";
    deleteBtn.textContent = "excluir";
    deleteBtn.onclick = async () => {
      await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      loadTasks();
    };

    li.append(span, editBtn, deleteBtn);
    list.appendChild(li);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  input.value = "";
  loadTasks();
});

loadTasks();
