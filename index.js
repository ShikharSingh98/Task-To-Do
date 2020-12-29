const date = document.getElementById('date');
const day = document.getElementById('day');
const monthYear = document.getElementById('month-year');
const addTaskForm = document.getElementById('add-task-form');
const addTaskInput = document.getElementById('add-task-input');
const tasksList = document.getElementById('tasks-list');
const tasksLeft = document.getElementById('tasks-left');
const clearAllTasksButton = document.getElementById('clear-all-tasks-button');

let tasksCount = 0;

// Set date details

date.textContent = moment().format('Do');
day.textContent = moment().format('dddd');
monthYear.textContent = moment().format('MMMM YYYY');

// Set tasks left
tasksLeft.innerText = tasksCount;

//Increment Tasks Counter

function incrementTasksCount() {
  tasksCount = tasksCount + 1;
  tasksLeft.innerText = tasksCount;
}

//Decrement Tasks Counter

function decrementTasksCount() {
  if (tasksCount > 0) {
    tasksCount = tasksCount - 1;
  }
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
  task.remove();
}

// Task Status : Completed or Not Completed

function taskStatus(event) {
  const checkbox = event.target;
  const span = checkbox.nextElementSibling;
  if (checkbox.checked) {
    span.classList.add('task-completed');
    decrementTasksCount();
  } else {
    span.classList.remove('task-completed');
    incrementTasksCount();
  }
}

// Create Task

function createTask(task) {
  const li = document.createElement('li');
  li.classList.add('task');

  const div = document.createElement('div');

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('task-checkbox');
  checkbox.addEventListener('click', taskStatus);

  const span = document.createElement('span');
  span.classList.add('task-text');
  span.innerText = task;

  div.append(checkbox, span);

  const icon = document.createElement('i');
  icon.classList.add('task-delete-icon', 'fas', 'fa-trash');
  icon.addEventListener('click', deleteTask);

  li.append(div, icon);

  tasksList.append(li);
}

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
});
