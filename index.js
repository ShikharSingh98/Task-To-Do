const date = document.getElementById('date');
const day = document.getElementById('day');
const monthYear = document.getElementById('month-year');
const addTaskForm = document.getElementById('add-task-form');
const addTaskInput = document.getElementById('add-task-input');
const tasksList = document.getElementById('tasks-list');
const tasksLeft = document.getElementById('tasks-left');
const clearAllTasksButton = document.getElementById('clear-all-tasks-button');

//create superscript
const superscript = document.createElement('sup');
superscript.classList.add('superscript');

const dt = parseInt(moment().format('D'));
if (dt >= 4 && dt <= 20) {
  superscript.innerText = 'th';
} else {
  const rem = dt % 10;
  switch (rem) {
    case 1:
      superscript.innerText = 'st';
      break;
    case 2:
      superscript.innerText = 'nd';
      break;
    case 3:
      superscript.innerText = 'rd';
      break;
    default:
      superscript.innerText = 'th';
  }
}
// Set date details
date.append(moment().format('D'), superscript);
day.textContent = moment().format('dddd');
monthYear.textContent = moment().format('MMMM YYYY');

//Save task to local storage
function saveTaskToLocal(task) {
  let tasks = [];
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// remove task from local storage
function removeTaskFromLocal(taskId) {
  let tasks = [];
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  const newTasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(newTasks));
}

//Change task status in Local Storage

function changeTaskStatusInLocal(taskId, status) {
  let tasks = [];
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  const newTasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: status } : task
  );
  localStorage.setItem('tasks', JSON.stringify(newTasks));
}

// Edit task in Local Storage

function editTaskInLocalStorage(taskId, taskData) {
  let tasks = [];
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  const newTasks = tasks.map((task) =>
    task.id === taskId ? { ...task, task: taskData } : task
  );
  localStorage.setItem('tasks', JSON.stringify(newTasks));
}

// Set tasks left counter

let tasksCount = 0;
const tasks = JSON.parse(localStorage.getItem('tasks'));
if (tasks) {
  tasks.forEach((task) => {
    if (!task.completed) {
      tasksCount = tasksCount + 1;
    }
  });
}
tasksLeft.innerText = tasksCount;

//Increment Tasks Counter

function incrementTasksCount() {
  tasksCount = tasksCount + 1;
  tasksLeft.innerText = tasksCount;
}

//Decrement Tasks Counter

function decrementTasksCount() {
  tasksCount = tasksCount - 1;
  tasksLeft.innerText = tasksCount;
}

//Edit Task

function editTask(event) {
  event.preventDefault();
  const editForm = event.target;
  const task = editForm.parentElement;
  const taskInput = editForm.children[0];
  const editButton = editForm.children[1];
  const checkbox = editForm.previousElementSibling;
  if (editButton.classList.contains('fa-edit')) {
    taskInput.disabled = false;
    taskInput.focus();
    taskInput.style.backgroundColor = '#dfdfdf';
    editButton.classList.remove('fa-edit');
    editButton.classList.add('fa-save');
    checkbox.disabled = true;
  } else {
    if (taskInput.value.trim()) {
      editTaskInLocalStorage(
        parseInt(task.dataset.taskId),
        taskInput.value.trim()
      );
      editButton.classList.remove('fa-save');
      editButton.classList.add('fa-edit');
      taskInput.style.backgroundColor = 'white';
      taskInput.disabled = true;
      checkbox.disabled = false;
    }
  }
}

//Delete Task

function deleteTask(event) {
  const task = event.target.parentElement;
  const checkbox = task.children[0];
  //If the checkbox is not checked then only decrement count
  if (!checkbox.checked) {
    decrementTasksCount();
  }

  removeTaskFromLocal(parseInt(task.dataset.taskId));
  task.remove();
}

// Task Status : Completed or Not Completed

function changeTaskStatus(event) {
  const checkbox = event.target;
  const input = checkbox.nextElementSibling.children[0];
  const editButton = checkbox.nextElementSibling.children[1];
  const taskId = parseInt(checkbox.parentElement.dataset.taskId);
  if (checkbox.checked) {
    input.classList.add('task-completed');
    changeTaskStatusInLocal(taskId, true);
    decrementTasksCount();
    editButton.style.display = 'none';
  } else {
    input.classList.remove('task-completed');
    changeTaskStatusInLocal(taskId, false);
    incrementTasksCount();
    editButton.style.display = 'inline';
  }
}

// On Input Change

function onInputChange(event) {
  const taskInput = event.target;
  const saveIcon = taskInput.nextElementSibling;
  if (taskInput.value.trim()) {
    taskInput.style.backgroundColor = '#dfdfdf';
    saveIcon.style.display = 'inline';
  } else {
    taskInput.placeholder = 'Task cannot be empty 😬';
    saveIcon.style.display = 'none';
  }
}

// Render task
function renderTask(task) {
  const li = document.createElement('li');
  li.classList.add('task');
  li.dataset.taskId = task.id;

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  if (task.completed) {
    checkbox.checked = true;
  }
  checkbox.classList.add('task-checkbox');
  checkbox.addEventListener('click', changeTaskStatus);

  const editForm = document.createElement('form');
  editForm.addEventListener('submit', editTask);
  editForm.classList.add('task-edit-form');

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.classList.add('task-input');
  input.addEventListener('keyup', onInputChange);
  input.disabled = true;
  if (task.completed) {
    input.classList.add('task-completed');
  }
  input.value = task.task;

  const editButton = document.createElement('button');
  editButton.classList.add('task-icon', 'fas', 'fa-edit');
  if (task.completed) {
    editButton.style.display = 'none';
  }

  editForm.append(input, editButton);

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('task-icon', 'fas', 'fa-trash');
  deleteIcon.addEventListener('click', deleteTask);

  li.append(checkbox, editForm, deleteIcon);

  tasksList.append(li);
}

//Render all task from local storage
function renderAllTasksFromLocal() {
  let tasks = [];
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.forEach((task) => renderTask(task));
}

// Create Task

function createTask(task) {
  const taskObj = {
    id: Date.now(),
    task: task.trim(),
    completed: false,
  };
  saveTaskToLocal(taskObj);
  renderTask(taskObj);
}

//On Content Load
document.addEventListener('DOMContentLoaded', renderAllTasksFromLocal);

// On add task form submit
addTaskForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const task = addTaskInput.value;
  createTask(task);

  //Increment Tasks Count
  incrementTasksCount();
  //clear input
  addTaskInput.value = '';
});

//On clear all task button click
clearAllTasksButton.addEventListener('click', function () {
  while (tasksList.childElementCount) {
    tasksList.children[tasksList.childElementCount - 1].remove();
  }
  tasksCount = 0;
  tasksLeft.innerText = tasksCount;
  localStorage.setItem('tasks', JSON.stringify([]));
});
