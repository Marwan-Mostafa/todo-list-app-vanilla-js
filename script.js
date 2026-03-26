const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("add-btn");
const listContainer = document.getElementById("list-container");



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();


function addTask() {
    const taskText = inputBox.value.trim();
    if (!taskText) {
        alert("You must write a task!");
        return;
    }

    const newTask = {
        text: taskText,
        completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    inputBox.value = '';
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    listContainer.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.completed) li.classList.add("checked");

        const span = document.createElement("span");
        span.textContent = "×";
        span.classList.add("delete-btn");
        li.appendChild(span);

        li.addEventListener("click", (e) => {
            if (e.target.tagName !== "SPAN") {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            }
        });

        span.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        listContainer.appendChild(li);
    });
}

addBtn.addEventListener("click", addTask);

inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});