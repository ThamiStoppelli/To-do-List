// import confetti from 'canvas-confetti';

// confetti.create(document.getElementById('canvas') as HTMLCanvasElement, {
//   resize: true,
//   useWorker: true,
// })({ particleCount: 200, spread: 200 });
import { v4 as uuidV4 } from 'uuid'

type Task = {
  id: string 
  title: string 
  completed: boolean
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.querySelector<HTMLFormElement>("#new-task-form")
// == const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")
const remove = document.querySelector<HTMLButtonElement>("#reset-list")
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const confirmButton = document.getElementById("confirm-btn");
const closeButton = document.getElementById("close-btn");

// const [open, setOpen] = useState<boolean>(false)

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return //this line ensures the input actually exists, after this statement the input is no longer null

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask)

  addListItem(newTask)
  input.value = ""
})

function addListItem(task: Task) {
  const item = document.createElement("li")
  item.classList.add("task-item");
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  const removeButton = document.createElement("button");

  if (task.completed) {
    label.classList.add("strikethrough")
  }

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    if (checkbox.checked) {
      label.classList.add("strikethrough")
    } else {
      label.classList.remove("strikethrough")
    }
    saveTasks()
  })
  checkbox.type = "checkbox"
  checkbox.checked = task.completed
  label.append(checkbox, task.title)

  removeButton.classList.add("remove-button");
  const trashIcon = document.createElement("img");
  trashIcon.src = "trash-icon-black.svg";
  trashIcon.alt = "Remover";
  removeButton.appendChild(trashIcon);

  removeButton.addEventListener("click", () => {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      const message = "Deseja realmente remover este item?";
      
      showModal(message, () => {
        tasks.splice(index, 1);
        item.remove();
        saveTasks();
        closeModal();
      })
    }
  });

  item.append(label, removeButton);
  list?.append(item)
  saveTasks()
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if (taskJSON == null) return []
 return JSON.parse(taskJSON)
}

remove?.addEventListener("click", () => {
  const message = "Deseja realmente remover todos os itens da Lista de Tarefas?";
      
  showModal(message, () => {
    tasks.length = 0
    localStorage.clear
    window.location.reload()
    saveTasks()
    closeModal();
  })
});

//input? or form? -> optional chaining: if this thing exists give me the value, if it doesn't return undefined

function showModal(message: string, onConfirm: () => void) {
  if (modalMessage == null) return
  modalMessage.innerText = message;
  modal?.classList.add("show-modal");

  if (confirmButton == null) return
  confirmButton.onclick = () => {
    onConfirm();
  };

  if (closeButton == null) return
  closeButton.onclick = () => {
    closeModal();
  };

  saveTasks()
}

function closeModal() {
  modal?.classList.remove("show-modal");
  saveTasks()
}