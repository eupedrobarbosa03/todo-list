const buttons = document.querySelectorAll("button[data-section]");
const sections = document.querySelectorAll(".section");
const form = document.querySelector("form");
const inputTask = document.querySelector("#input_task");
const inputAddTask = document.querySelector("#input_submit_task");
const inputCleanTask = document.querySelector("#input_clean_task");
const messageErrorTask = document.querySelector("#message_error");
const tasks = document.querySelector("#container_tasks");
const editTask = document.querySelector("#section_edit");
const inputEditTask = document.querySelector("#input_task_edit");
const inputSubmitEditTask = document.querySelector("#input_submit_task_edit");
const logs = document.querySelector("#section_logs");
const boxLog = document.querySelector(".box_logs");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        //Effect selected code
        buttons.forEach((btn) => btn.classList.remove("button_selected"));
        button.classList.add("button_selected");

        const id = button.getAttribute("data-section");
        sections.forEach((section) => section.style.display = "none");
        const section = document.getElementById(id);
        section ? section.style.display = "block" : null;
        messageError(false, "");
    })
})

form.addEventListener("click", (e) => e.preventDefault());

const messageError = (mode=false, message) => {
    messageErrorTask.textContent = message;
    mode
    ? messageErrorTask.classList.add("show_error")
    : messageErrorTask.classList.remove("show_error");
}

const templateTask = (taskName) => {
    const template = 
    `
        <div class="task">
            <h2 class="task_name">${taskName}</h2>
            <nav class="actions_task">
                <button class="task_check box_action">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="task_edit box_action">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="task_remove box_action">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </nav>
        </div>
    `;
    const parse = new DOMParser();
    const templateHtml = parse.parseFromString(template, "text/html");
    const task = templateHtml.querySelector("div");
    tasks.appendChild(task);
};

let currentEditTask = null;
let oldTaskName = "";

const quantityCheck = document.querySelector("#quantity_task_check");
const quantityPeding = document.querySelector("#quantity_task_peding");
const quantityDelete = document.querySelector("#quantity_task_delete");

class Task {
    constructor () {}

    toAdd(taskName) {
        const firstIndexTaskName = taskName[0];
        const taskNameLength = { min: 5, max: 35 };
        if (!isNaN(firstIndexTaskName)) return messageError (
            true, "O nome da tarefa não deve começar com números ou espaços."
        )

        if (taskName.trim() === "") return messageError (
            true, "Digite algo."
        )

        taskName = taskName.trim();

        if (taskName.length < taskNameLength.min) return messageError (
            true, `O nome da tarefa deve conter no mínimo ${taskNameLength.min} caracteres.`
        )

        if (taskName.length > taskNameLength.max) return messageError (
            true, `O nome da tarefa deve conter no máximo ${taskNameLength.max} caracteres.`
        )

        messageError(false);
        templateTask(taskName);
        inputTask.value = '';
        inputTask.focus();
        this.update("", taskName, 'add');
        quantityPeding.textContent = Number(quantityPeding.textContent) + 1;

    }

    update(oldTask, task, updateName) {

        let message = "";

        switch (updateName) {
            case 'add':
                message = `A tarefa '${task}' foi adicionada.`
                break;
            case 'check':
                message = `A tarefa '${task}' foi marcada com concluída.`
                break;
            case 'edit':
                message = `A tafera '${oldTask}' foi renomeada para '${task}'.`
                break;
            case 'delete':
                message = `A tarefa '${task}' foi removida.`
                break;
            case 'deleteAll':
                message = `Todas as tarefas foram removidas.`
                break;
            default:
                console.error('Tipo de atualização inexistente.');
                break;
        }

        const template = 
        `<div class="box_logs">${message}</div>`;
        const parser = new DOMParser();
        const templateHtml = parser.parseFromString(template, 'text/html');
        const logTask = templateHtml.querySelector("div");
        logs.appendChild(logTask);
    }

    toClean() {
        inputTask.value = '';
    }

    check(e) {
        if (e.target.classList.contains("task_check")) {
            const task = e.target.closest(".task");
            if (!task) return;
            const taskName = task.querySelector(".task_name").textContent;
            task.classList.toggle("check");
            this.update("", taskName, 'check');
            let hadCheck = false;
            if (!(task.getAttribute("class").includes("check") && !hadCheck)) {
                quantityCheck.textContent = Number(quantityCheck.textContent) - 1;
                quantityPeding.textContent = Number(quantityPeding.textContent) + 1;
                return;
            }
            hadCheck = true;
            quantityPeding.textContent = Number(quantityPeding.textContent) - 1;
            quantityCheck.textContent = Number(quantityCheck.textContent) + 1;
        }
    }

    delete(e) {
        if (e.target.classList.contains("task_remove")) {
            const task = e.target.closest(".task");
            if (!task) return;
            const taskName = task.querySelector(".task_name").textContent;
            this.update("", taskName, 'delete')
            task.remove()
            quantityDelete.textContent = Number(quantityDelete.textContent) + 1;
            if (task.getAttribute("class").includes("check")) {
                quantityCheck.textContent = Number(quantityCheck.textContent) - 1;
            }
            if (Number(quantityPeding.textContent) === 0) {
                return;
            }
            quantityPeding.textContent = Number(quantityPeding.textContent) - 1;
        }
    }

    edit(e) {
        if (e.target.classList.contains("task_edit")) {
            const task = e.target.closest(".task");
            if (!task) return;
            const taskName = task.querySelector(".task_name");
            editTask.classList.add("show");
            inputEditTask.value = taskName.textContent;
            oldTaskName = task.textContent;
            currentEditTask = task;
        }
    }
}

const taskActions = new Task();

inputAddTask.addEventListener("click", () => {
    taskActions.toAdd(inputTask.value);
})

inputCleanTask.addEventListener("click", () => {
    taskActions.toClean();
    messageError(false);
})

tasks.addEventListener("click", (e) => {
    taskActions.check(e);
    taskActions.delete(e);
    taskActions.edit(e);
})

inputSubmitEditTask.addEventListener("click", () => {
    currentEditTask.innerHTML = `
        <h2 class="task_name">${inputEditTask.value}</h2>
        <nav class="actions_task">
            <button class="task_check box_action">
                <i class="fa-solid fa-check"></i>
            </button>
            <button class="task_edit box_action">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="task_remove box_action">
                <i class="fa-solid fa-trash"></i>
            </button>
        </nav>
    `
    editTask.classList.remove("show")
    taskActions.update(oldTaskName, inputEditTask.value, 'edit');
})

window.addEventListener("keyup", (e) => {
    e.key === "Escape"
    ? editTask.classList.remove("show")
    : null;
})

const side = document.querySelector("#change_side");
let checkSide = false;

side.addEventListener("click", () => {
    checkSide ? checkSide = false : checkSide = true;
    const headerOrder = document.querySelector("#header_container");
    const sectionOrder = document.querySelector("#section_container");
    if (checkSide) {
        headerOrder.style.order = "2";
        sectionOrder.style.order = "1";
        return;
    }
    headerOrder.style.order = "1";
    sectionOrder.style.order = "2";
})

const buttonDeleteAllTasks = document.querySelector("#deleteAll_Tasks");

buttonDeleteAllTasks.addEventListener("click", () => {
    quantityCheck.textContent = "0";
    quantityDelete.textContent = "0";
    quantityPeding.textContent = "0";
    const tasks = document.querySelectorAll(".task");
    if (tasks.length === 0) return;
    tasks.forEach((task) => task.remove());
    taskActions.update("", "", "deleteAll");
})