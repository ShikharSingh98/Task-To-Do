const date = document.getElementById('date');
const day = document.getElementById('day');
const monthYear = document.getElementById('month-year');

// Set date details

date.textContent = moment().format('Do');
day.textContent = moment().format('dddd');
monthYear.textContent = moment().format('MMMM YYYY');
