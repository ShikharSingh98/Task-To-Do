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

// Render task
function renderTask(task) {
  const li = document.createElement('li');
  li.classList.add('task');
  li.dataset.taskId = task.id;

  const div = document.createElement('div');

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  if (task.completed) {
    checkbox.checked = true;
  }
  checkbox.classList.add('task-checkbox');
  checkbox.addEventListener('click', changeTaskStatus);

  const span = document.createElement('span');
  span.classList.add('task-text');
  if (task.completed) {
    span.classList.add('task-completed');
  }
  span.innerText = task.task;

  div.append(checkbox, span);

  const icon = document.createElement('i');
  icon.classList.add('task-delete-icon', 'fas', 'fa-trash');
  icon.addEventListener('click', deleteTask);

  li.append(div, icon);

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

//Delete Task

function deleteTask(event) {
  const task = event.target.parentElement;
  const checkbox = task.children[0].children[0];
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
  const span = checkbox.nextElementSibling;
  const taskId = parseInt(
    event.target.parentElement.parentElement.dataset.taskId
  );
  if (checkbox.checked) {
    span.classList.add('task-completed');
    changeTaskStatusInLocal(taskId, true);
    decrementTasksCount();
  } else {
    span.classList.remove('task-completed');
    changeTaskStatusInLocal(taskId, false);
    incrementTasksCount();
  }
}

// Create Task

function createTask(task) {
  const taskObj = {
    id: Date.now(),
    task: task,
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
