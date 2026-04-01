const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("add-btn");
const listContainer = document.getElementById("list-container");
const clearBtn = document.getElementById("clear-all");
const taskCount = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

renderTasks();

// Add Task
function addTask() {
    const taskText = inputBox.value.trim();
    if (!taskText) {
        alert("You must write a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    // Add new task element without re-rendering all
    const li = document.createElement("li");
    li.textContent = newTask.text;

    const span = document.createElement("span");
    span.textContent = "×";
    span.classList.add("delete-btn");
    li.appendChild(span);

    li.addEventListener("click", (e) => {
        if (e.target.tagName !== "SPAN") {
            newTask.completed = !newTask.completed;
            saveTasks();
            renderTasks();
        }
    });

    li.addEventListener("dblclick", () => {
        const newText = prompt("Edit task:", newTask.text);
        if (newText && newText.trim() !== "") {
            newTask.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    });

    span.addEventListener("click", () => {
        li.classList.remove("show"); // fade-out
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== newTask.id);
            saveTasks();
            renderTasks();
        }, 200);
    });

    listContainer.appendChild(li);
    setTimeout(() => li.classList.add("show"), 50);

    inputBox.value = '';
    inputBox.focus();

    updateTaskCount();
}

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks (used for filter and toggle)
function renderTasks() {
    listContainer.innerHTML = '';

    let filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    filteredTasks.forEach((task) => {
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

        li.addEventListener("dblclick", () => {
            const newText = prompt("Edit task:", task.text);
            if (newText && newText.trim() !== "") {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        });

        span.addEventListener("click", () => {
            li.classList.remove("show");
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            }, 200);
        });

        listContainer.appendChild(li);
        setTimeout(() => li.classList.add("show"), 50);
    });

    updateTaskCount();
}

// Update task counter
function updateTaskCount() {
    taskCount.textContent = `You have ${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
}

// Filters with active state
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filter = btn.id;
        renderTasks();
    });
});

// Clear All
clearBtn.addEventListener("click", () => {
    if (confirm("Delete all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});

// Add via button
addBtn.addEventListener("click", addTask);

// Add via Enter key
inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTask();
    }
});