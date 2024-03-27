// Определяем объект базы данных
let database = {
  processes: []
};

// Обработчик события для навигационных ссылок
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', handleNavLinkClick);
});

function handleNavLinkClick(event) {
  event.preventDefault();
  const linkId = event.target.dataset.link;
  showSection(linkId);
}

// Функция для отображения раздела приложения
const appSection = document.getElementById('app-section');
const processSection = document.getElementById('process-section');
const addProcessSection = document.getElementById('add-process-section');
const editProcessSection = document.getElementById('edit-process-section');
const editProcessForm = document.getElementById('edit-process-form');
const cancelEditButton = document.getElementById('cancel-edit');

function showSection(sectionId) {
  const sections = [processSection, addProcessSection, editProcessSection];
  sections.forEach(section => {
    section.style.display = 'none';
  });

  switch (sectionId) {
    case 'current-processes':
      processSection.style.display = 'block';
      renderProcessList();
      break;
    case 'add-process':
      addProcessSection.style.display = 'block';
      processForm.reset();
      break;
    case 'all-processes':
      processSection.style.display = 'block';
      renderProcessList();
      break;
    default:
      break;
  }
}

// Функция для отображения списка процессов
const processList = document.getElementById('process-list');

function renderProcessList() {
  processList.innerHTML = '';
  database.processes.forEach((process, index) => {
    const listItem = document.createElement('li');
    const removeButton = document.createElement('button');
    const editButton = document.createElement('button');
    removeButton.textContent = 'Удалить';
    editButton.textContent = 'Редактировать';
    removeButton.addEventListener('click', () => removeProcess(index));
    editButton.addEventListener('click', () => editProcess(index));
    listItem.textContent = `${process.name} (${process.startDate} - ${process.endDate || 'Открытая'})`;
    listItem.appendChild(removeButton);
    listItem.appendChild(editButton);
    processList.appendChild(listItem);
  });
}

// Функция для удаления процесса
function removeProcess(index) {
  database.processes.splice(index, 1);
  renderProcessList();
}

// Функция для редактирования процесса
function editProcess(index) {
  const process = database.processes[index];
  editProcessForm['edit-process-name'].value = process.name;
  editProcessForm['edit-process-start'].value = process.startDate;
  editProcessForm['edit-process-end'].value = process.endDate || '';
  editProcessForm['edit-process-task'].value = process.task;
  editProcessForm['edit-process-employees'].value = process.employees.join(',');
  showEditSection();
}

// Функция для отображения раздела редактирования процесса
function showEditSection() {
  processSection.style.display = 'none';
  addProcessSection.style.display = 'none';
  editProcessSection.style.display = 'block';
}

// Обработчик события для кнопки "Отмена" при редактировании процесса
cancelEditButton.addEventListener('click', () => {
  showSection('current-processes');
});

// Обработчик события для формы редактирования процесса
editProcessForm.addEventListener('submit', handleEditProcess);

function handleEditProcess(event) {
  event.preventDefault();
  const index = parseInt(editProcessForm['edit-process-index'].value);
  const processName = editProcessForm['edit-process-name'].value.trim();
  const processStartDate = editProcessForm['edit-process-start'].value;
  const processEndDate = editProcessForm['edit-process-end'].value;
  const processTask = editProcessForm['edit-process-task'].value.trim();
  const processEmployees = editProcessForm['edit-process-employees'].value.trim().split(',');
  
  if (processName && processStartDate && processTask && processEmployees.length > 0) {
    // Проверка корректности выбранной даты окончания
    if (processEndDate && processEndDate < processStartDate) {
      alert('Дата окончания не может быть раньше даты начала');
      return;
    }

    const updatedProcess = {
      name: processName,
      startDate: processStartDate,
      endDate: processEndDate || null,
      task: processTask,
      employees: processEmployees
    };
    database.processes[index] = updatedProcess;
    renderProcessList();
    showSection('current-processes');
  } else {
    alert('Заполните все поля формы');
  }
}

// Обработчик события для формы добавления процесса
const processForm = document.getElementById('process-form');
processForm.addEventListener('submit', handleAddProcess);

function handleAddProcess(event) {
  event.preventDefault();
  const processName = document.getElementById('process-name').value.trim();
  const processStartDate = document.getElementById('process-start').value;
  const processEndDateInput = document.getElementById('process-end');
  const processEndDate = processEndDateInput.value;
  const processTask = document.getElementById('process-task').value.trim();
  const processEmployees = document.getElementById('process-employees').value.trim().split(',');
  
  // Установка минимальной даты для поля даты окончания
  processEndDateInput.min = processStartDate;

  if (processName && processStartDate && processTask && processEmployees.length > 0) {
    // Проверка корректности выбранной даты окончания
    if (processEndDate && processEndDate < processStartDate) {
      alert('Дата окончания не может быть раньше даты начала');
      return;
    }

    const newProcess = {
      name: processName,
      startDate: processStartDate,
      endDate: processEndDate || null,
      task: processTask,
      employees: processEmployees
    };
    database.processes.push(newProcess);
    saveDataToLocalStorage(); // Сохраняем данные в локальное хранилище
    showSection('current-processes'); // Отображаем список текущих процессов
  } else {
    alert('Заполните все поля формы');
  }
}

// Сохранение данных в локальное хранилище
function saveDataToLocalStorage() {
  localStorage.setItem('productionPlatformDB', JSON.stringify(database));
}

// Загрузка данных из локального хранилища при запуске приложения
window.addEventListener('DOMContentLoaded', () => {
  const storedData = localStorage.getItem('productionPlatformDB');
  if (storedData) {
    database = JSON.parse(storedData);
    showSection('current-processes');
  }
});

