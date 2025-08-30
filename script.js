let users = {};
let currentUser = null;
let tasks = [];


function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}


function loadUsers() {
  const saved = localStorage.getItem("users");
  if (saved) {
    users = JSON.parse(saved);
  }
}

function saveTasks() {
  if (currentUser) {
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
  }
}


function loadTasks() {
  if (currentUser) {
    const saved = localStorage.getItem(`tasks_${currentUser}`);
    tasks = saved ? JSON.parse(saved) : [];
  } else {
    tasks = [];
  }
}

window.onload = function() {
  loadUsers();
};


function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (users[username] && users[username] === password) {
    currentUser = username;
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("registerContainer").style.display = "none";
    document.getElementById("todoContainer").style.display = "flex";
    loadTasks();
    renderTasks();
  } else {
    alert("Invalid username or password");
  }
}

// Update logout to clear currentUser and tasks
function logout() {
  currentUser = null;
  tasks = [];
  document.getElementById("todoContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "block";
}

// Update register to save users
function register() {
  let username = document.getElementById("regUsername").value;
  let password = document.getElementById("regPassword").value;

  if (!users[username]) {
    users[username] = password;
    saveUsers(); // Save after registering
    alert("Registered successfully! Please login.");
    showLogin();
  } else {
    alert("User already exists!");
  }
}

function showRegister() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("registerContainer").style.display = "block";
}

function showLogin() {
  document.getElementById("registerContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "block";
}

function addTask() {
  let taskInput = document.getElementById("taskInput").value;
  let dueDate = document.getElementById("dueDate").value;
  let category = document.getElementById("category").value;

  if (taskInput === "") {
    alert("Please enter a task!");
    return;
  }

  let task = {
    text: taskInput,
    dueDate: dueDate,
    category: category,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  let search = document.getElementById("search").value.toLowerCase();
  let filter = document.getElementById("filter").value;

  tasks.forEach((task, i) => {
    if (
      (filter === "all" || (filter === "completed" && task.completed) || (filter === "pending" && !task.completed)) &&
      (task.text.toLowerCase().includes(search) || task.category.toLowerCase().includes(search))
    ) {
      let li = document.createElement("li");
      li.className = task.completed ? "completed" : "";

      li.innerHTML = `
        <span>
          <strong>${task.text}</strong> 
          <small>(${task.category} - ${task.dueDate || "No date"})</small>
        </span>
        <div>
          <button onclick="toggleTask(${i})">${task.completed ? "Undo" : "Done"}</button>
          <button onclick="deleteTask(${i})">Delete</button>
        </div>
      `;
      list.appendChild(li);
    }
  });

  document.getElementById("submitCompleted").style.display =
    tasks.some(t => t.completed) ? "block" : "none";
}

function submitCompleted() {
  alert("Completed tasks are kept until you delete them manually.");
}
