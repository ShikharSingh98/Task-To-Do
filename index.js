const date = document.getElementById('date');
const day = document.getElementById('day');
const monthYear = document.getElementById('month-year');
const addTaskForm = document.getElementById('add-task-form');
const addTaskInput = document.getElementById('add-task-input');
const tasksList = document.getElementById('tasks-list');
const tasksLeft = document.getElementById('tasks-left');

let tasksCount = 0;

// Set date details

date.textContent = moment().format('Do');
day.textContent = moment().format('dddd');
monthYear.textContent = moment().format('MMMM YYYY');

// Set tasks left
tasksLeft.innerText = tasksCount;

//Delete Task

function deleteTask(event) {
  const task = event.target.parentElement;
  task.remove();

  //Decrement Tasks Count
  tasksCount = tasksCount - 1;
  tasksLeft.innerText = tasksCount;
}

// Create Task

function createTask(task) {
  const li = document.createElement('li');
  li.classList.add('task');

  const div = document.createElement('div');

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('task-checkbox');

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
  tasksCount = tasksCount + 1;
  tasksLeft.innerText = tasksCount;

  //clear input
  addTaskInput.value = '';
});
