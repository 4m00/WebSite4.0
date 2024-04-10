// Учетные данные пользователей
const users = [
  { username: 'admin', password: 'admin' },
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
];

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Проверка имени пользователя и пароля
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    document.getElementById('username').innerText = username;
    document.getElementById('welcome-section').style.display = 'none';
    document.querySelector('header').style.display = 'block';
    document.getElementById('app-section').style.display = 'block';
  } else {
    alert('Неверный логин или пароль');
  }
});

// Обработчик события для навигационных ссылок
const navLinks = document.querySelectorAll('#nav-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', handleNavLinkClick);
});

function handleNavLinkClick(event) {
  event.preventDefault();
  const linkId = event.target.dataset.link;
  showSection(linkId);
}

// Функция для отображения раздела приложения
const sections = {
  'current-processes': document.getElementById('process-section'),
  'add-process': document.getElementById('add-process-section'),
  'edit-process': document.getElementById('edit-process-section'),
  'all-processes': document.getElementById('process-section'),
  'materials': document.getElementById('materials-section'),
  'equipment': document.getElementById('equipment-section'),
  'quality-control': document.getElementById('quality-control-section'),
  'cost-management': document.getElementById('cost-management-section'),
  'process-visualization': document.getElementById('process-visualization-section'),
  'orders': document.getElementById('orders-section')
};

function showSection(sectionId) {
  Object.values(sections).forEach(section => {
    section.style.display = 'none';
  });

  const selectedSection = sections[sectionId];
  if (selectedSection) {
    selectedSection.style.display = 'block';
    switch (sectionId) {
      case 'current-processes':
      case 'all-processes':
        renderProcessList();
        break;
      case 'materials':
        renderMaterialsList();
        break;
      case 'equipment':
        renderEquipmentList();
        break;
      case 'quality-control':
        renderQualityChecksList();
        break;
      case 'cost-management':
        renderCostsList();
        break;
      case 'orders':
        renderOrdersList();
        break;
      default:
        break;
    }
  }
}

// Переменная для отслеживания индекса редактируемого процесса
let currentEditingProcessIndex = null;

// Обработчик события для формы добавления процесса
const addProcessForm = document.getElementById('add-process-form');
addProcessForm.addEventListener('submit', handleAddProcess);

// Обработчик события для формы редактирования процесса
const editProcessForm = document.getElementById('edit-process-form');
editProcessForm.addEventListener('submit', function(event) {
  event.preventDefault();
  if (currentEditingProcessIndex !== null) {
    // Вызов функции обновления процесса с проверкой возвращаемого значения
    const isUpdated = updateProcess(currentEditingProcessIndex);
    if (isUpdated) {
      // Если процесс успешно обновлен, очистить индекс редактируемого процесса и показать список процессов
      currentEditingProcessIndex = null;
      showSection('current-processes');
    }
    // Если процесс не обновлен (например, из-за ошибки дат), форма останется открытой
  }
});

// Функция для редактирования процесса
function editProcess(index) {
  if (index >= 0 && index < database.processes.length) {
    const process = database.processes[index];
    const editForm = document.getElementById('edit-process-form');
    editForm['process-name'].value = process.name;
    editForm['process-startDate'].value = process.startDate;
    editForm['process-endDate'].value = process.endDate || '';
    editForm['process-participants'].value = process.participants.join(', ');
    editForm['process-developmentStage'].value = process.developmentStage;
    currentEditingProcessIndex = index;
    showSection('edit-process');
  } else {
    alert('Недопустимый индекс процесса');
  }
}

// Функция для отображения списка процессов с обновленными кнопками редактирования, удаления и просмотра
function renderProcessList() {
    const processListElement = document.getElementById('process-list');
    processListElement.innerHTML = ''; // Очищаем список

    database.processes.forEach((process, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${process.name} (${formatDate(process.startDate)} - ${process.endDate ? formatDate(process.endDate) : 'Открытая'}) Участники: ${process.participants.join(', ')} Этап: ${process.developmentStage}`;        listItem.style.cursor = 'pointer';

        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события, чтобы клик по кнопке не считался кликом по элементу списка
            editProcess(index);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Аналогично предотвращаем всплытие события
            removeProcess(index);
            renderProcessList(); // Перерисовываем список
        });

        // Добавляем кнопки редактирования и удаления к элементу списка
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        // Добавляем обработчик клика для просмотра деталей процесса
        listItem.addEventListener('click', () => {
            viewProcess(index);
        });

        // Добавляем элемент списка на страницу
        processListElement.appendChild(listItem);
    });
}

// Функция удаления процесса
function removeProcess(index) {
    database.processes.splice(index, 1);
}

// Функция для обновления процесса
function updateProcess(index) {
  const processName = editProcessForm['process-name'].value.trim();
  const processStartDate = editProcessForm['process-startDate'].value;
  const processEndDate = editProcessForm['process-endDate'].value || null;
  const processParticipants = editProcessForm['process-participants'].value.split(',').map(p => p.trim());
  const processDevelopmentStage = editProcessForm['process-developmentStage'].value.trim();

  if (!processName || !processStartDate) {
    alert('Заполните все обязательные поля формы');
    return false; // Возвращаем false, чтобы указать на ошибку валидации
  }

  if (processEndDate && new Date(processEndDate) < new Date(processStartDate)) {
    alert('Дата окончания процесса не может быть раньше даты начала');
    return false; // Продолжаем оставлять форму открытой для редактирования
  }

  // Если все проверки пройдены, обновляем процесс
  const updatedProcess = {
    name: processName,
    startDate: processStartDate,
    endDate: processEndDate,
    participants: processParticipants,
    developmentStage: processDevelopmentStage
  };
  database.processes[index] = updatedProcess;
  renderProcessList();
  
  return true; // Успешное обновление
}

// Функция для просмотра процесса
function viewProcess(index) {
  const process = database.processes[index];
  const processDetails = `
    Название: ${process.name}<br>
    Дата начала: ${process.startDate}<br>
    Дата окончания: ${process.endDate || 'Не указана'}<br>
    Участники: ${process.participants.join(', ')}<br>
    Этап разработки: ${process.developmentStage}`;

  // Отображаем детали процесса в модальном окне
  document.getElementById('processDetails').innerHTML = processDetails;
  document.getElementById('processModal').style.display = "block";
}

// Код для закрытия модального окна
var modal = document.getElementById('processModal');
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Обновленная функция для добавления процесса с проверкой даты окончания
function handleAddProcess(event) {
  event.preventDefault();
  const processName = document.getElementById('process-name').value.trim();
  const processStartDate = document.getElementById('process-startDate').value;
  const processEndDate = document.getElementById('process-endDate').value || null;
  const processParticipants = document.getElementById('process-participants').value.split(',').map(p => p.trim());
  const processDevelopmentStage = document.getElementById('process-developmentStage').value.trim();

  // Проверка даты окончания процесса
  if (processEndDate && new Date(processEndDate) < new Date(processStartDate)) {
    alert('Дата окончания процесса не может быть раньше даты начала');
    return;
  }

  if (processName && processStartDate) {
    const newProcess = {
      name: processName,
      startDate: processStartDate,
      endDate: processEndDate,
      participants: processParticipants,
      developmentStage: processDevelopmentStage
    };
    database.processes.push(newProcess);
    renderProcessList();
    addProcessForm.reset();
    showSection('current-processes'); 
  } else {
    alert('Заполните все обязательные поля формы');
  }
}


// Функции для работы с материалами
const materialsList = document.getElementById('materials-list');

function renderMaterialsList() {
  materialsList.innerHTML = '';
  database.materials.forEach((material, index) => {
    const listItem = document.createElement('li');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Удалить';
    removeButton.addEventListener('click', () => removeMaterial(index));
    listItem.textContent = `${material.name} (${material.quantity} ${material.unit})`;
    listItem.appendChild(removeButton);
    materialsList.appendChild(listItem);
  });
}

function removeMaterial(index) {
  database.materials.splice(index, 1);
  renderMaterialsList();
}

const materialForm = document.getElementById('material-form');
materialForm.addEventListener('submit', handleAddMaterial);

function handleAddMaterial(event) {
  event.preventDefault();
  const materialName = document.getElementById('material-name').value.trim();
  const materialQuantity = document.getElementById('material-quantity').value;
  const materialUnit = document.getElementById('material-unit').value.trim();

  if (materialName && materialQuantity && materialUnit) {
    const newMaterial = {
      name: materialName,
      quantity: materialQuantity,
      unit: materialUnit
    };
    database.materials.push(newMaterial);
    renderMaterialsList();
    materialForm.reset();
  } else {
    alert('Заполните все поля формы');
  }
}

// Функции для работы с оборудованием
const equipmentList = document.getElementById('equipment-list');

function renderEquipmentList() {
  equipmentList.innerHTML = '';
  database.equipment.forEach((equipment, index) => {
    const listItem = document.createElement('li');
    const removeButton = document.createElement('button');
    const editButton = document.createElement('button');
    removeButton.textContent = 'Удалить';
    editButton.textContent = 'Редактировать';
    removeButton.addEventListener('click', () => removeEquipment(index));
    editButton.addEventListener('click', () => editEquipment(index));
    listItem.textContent = `${equipment.name} (${equipment.type}, ${equipment.status})`;
    listItem.appendChild(removeButton);
    listItem.appendChild(editButton);
    equipmentList.appendChild(listItem);
  });
}

function removeEquipment(index) {
  database.equipment.splice(index, 1);
  renderEquipmentList();
}

function editEquipment(index) {
  const equipment = database.equipment[index];
  const equipmentForm = document.getElementById('equipment-form');
  equipmentForm['equipment-name'].value = equipment.name;
  equipmentForm['equipment-type'].value = equipment.type;
  equipmentForm['equipment-status'].value = equipment.status;
  // Добавьте здесь код для отображения формы редактирования оборудования
}

const equipmentForm = document.getElementById('equipment-form');
equipmentForm.addEventListener('submit', handleAddEquipment);

function handleAddEquipment(event) {
  event.preventDefault();
  const equipmentName = document.getElementById('equipment-name').value.trim();
  const equipmentType = document.getElementById('equipment-type').value.trim();
  const equipmentStatus = document.getElementById('equipment-status').value;

  if (equipmentName && equipmentType && equipmentStatus) {
    const newEquipment = {
      name: equipmentName,
      type: equipmentType,
      status: equipmentStatus
    };
    database.equipment.push(newEquipment);
    renderEquipmentList();
    equipmentForm.reset();
  } else {
    alert('Заполните все поля формы');
  }
}

// Функции для работы с проверками качества
const qualityChecksList = document.getElementById('quality-checks-list');

function renderQualityChecksList() {
  qualityChecksList.innerHTML = '';
  database.qualityChecks.forEach((check, index) => {
    const listItem = document.createElement('li');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Удалить';
    removeButton.addEventListener('click', () => removeQualityCheck(index));
    listItem.textContent = `${check.product} (${check.date}, ${check.result})`;
    listItem.appendChild(removeButton);
    qualityChecksList.appendChild(listItem);
  });
}

function removeQualityCheck(index) {
  database.qualityChecks.splice(index, 1);
  renderQualityChecksList();
}

const qualityCheckForm = document.getElementById('quality-check-form');
qualityCheckForm.addEventListener('submit', handleAddQualityCheck);

function handleAddQualityCheck(event) {
  event.preventDefault();
  const productName = document.getElementById('quality-check-product').value.trim();
  const checkDate = document.getElementById('quality-check-date').value.trim();
  const checkResult = document.getElementById('quality-check-result').value.trim();

  if (productName && checkDate && checkResult) {
    const newQualityCheck = {
      product: productName,
      date: checkDate,
      result: checkResult
    };
    database.qualityChecks.push(newQualityCheck);
    renderQualityChecksList();
    qualityCheckForm.reset();
  } else {
    alert('Заполните все поля формы');
  }
}

// Функции для работы с затратами
const costsList = document.getElementById('costs-list');

function renderCostsList() {
  costsList.innerHTML = '';
  database.costs.forEach((cost, index) => {
    const listItem = document.createElement('li');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Удалить';
    removeButton.addEventListener('click', () => removeCost(index));
    listItem.textContent = `${cost.item} (${cost.amount} ${cost.currency})`;
    listItem.appendChild(removeButton);
    costsList.appendChild(listItem);
  });
}

function removeCost(index) {
  database.costs.splice(index, 1);
  renderCostsList();
}

const costForm = document.getElementById('cost-form');
costForm.addEventListener('submit', handleAddCost);

function handleAddCost(event) {
  event.preventDefault();
  const costItem = document.getElementById('cost-name').value.trim();
  const costAmount = document.getElementById('cost-amount').value;
  const costCurrency = document.getElementById('cost-date').value.trim();

  if (costItem && costAmount && costCurrency) {
    const newCost = {
      item: costItem,
      amount: costAmount,
      currency: costCurrency
    };
    database.costs.push(newCost);
    renderCostsList();
    costForm.reset();
  } else {
    alert('Заполните все поля формы');
  }
}

// Функции для работы с заказами
const ordersList = document.getElementById('orders-list');

function renderOrdersList() {
  ordersList.innerHTML = '';
  database.orders.forEach((order, index) => {
    const listItem = document.createElement('li');
    const removeButton = document.createElement('button');
    const editButton = document.createElement('button');
    removeButton.textContent = 'Удалить';
    editButton.textContent = 'Редактировать';
    removeButton.addEventListener('click', () => removeOrder(index));
    editButton.addEventListener('click', () => editOrder(index));
    listItem.textContent = `${order.customer} (${order.product}, ${order.quantity})`;
    listItem.appendChild(removeButton);
    listItem.appendChild(editButton);
    ordersList.appendChild(listItem);
  });
}

function removeOrder(index) {
  database.orders.splice(index, 1);
  renderOrdersList();
}

function editOrder(index) {
  const order = database.orders[index];
  const orderForm = document.getElementById('order-form');
  orderForm['customer-name'].value = order.customer;
  orderForm['product-name'].value = order.product;
  orderForm['order-quantity'].value = order.quantity;
  // Добавьте здесь код для отображения формы редактирования заказа
}

function updateOrder(index) {
  const customerName = document.getElementById('customer-name').value.trim();
  const productName = document.getElementById('product-name').value.trim();
  const orderQuantity = document.getElementById('order-quantity').value;

  if (customerName && productName && orderQuantity) {
    const updatedOrder = {
      customer: customerName,
      product: productName,
      quantity: orderQuantity
    };
    database.orders[index] = updatedOrder;
    renderOrdersList();
    // Здесь вы можете закрыть форму редактирования заказа
  } else {
    alert('Заполните все поля формы');
  }
}

const orderForm = document.getElementById('order-form');
orderForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const editIndex = orderForm.dataset.editIndex;
  if (editIndex !== undefined) {
    updateOrder(editIndex);
  } else {
    handleAddOrder(event);
  }
});

function handleAddOrder(event) {
  event.preventDefault();
  const customerName = document.getElementById('customer-name').value.trim();
  const productName = document.getElementById('product-name').value.trim();
  const orderQuantity = document.getElementById('order-quantity').value;

  if (customerName && productName && orderQuantity) {
    const newOrder = {
      customer: customerName,
      product: productName,
      quantity: orderQuantity
    };
    database.orders.push(newOrder);
    renderOrdersList();
    orderForm.reset();
  } else {
    alert('Заполните все поля формы');
  }
}

// Функция для форматирования времени
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}.${month}.${year}`;
}

// Пример базы данных для использования в этом коде
const database = {
  processes: [
    { name: 'Процесс 1', startDate: '2024-03-01', endDate: '2024-03-10', participants: ['Участник 1', 'Участник 2'], developmentStage: 'Этап 1' },
    { name: 'Процесс 2', startDate: '2024-03-05', endDate: '2024-03-15', participants: ['Участник 3', 'Участник 4'], developmentStage: 'Этап 2' },
    { name: 'Процесс 3', startDate: '2024-03-10', participants: ['Участник 5'], developmentStage: 'Этап 3' }
  ],
  materials: [
    { name: 'Материал 1', quantity: 100, unit: 'кг' },
    { name: 'Материал 2', quantity: 50, unit: 'л' }
  ],
  equipment: [
    { name: 'Оборудование 1', type: 'Тип 1', status: 'Рабочее' },
    { name: 'Оборудование 2', type: 'Тип 2', status: 'Ремонт' }
  ],
  qualityChecks: [
    { product: 'Продукт 1', date: '2024-03-05', result: 'Успешно' },
    { product: 'Продукт 2', date: '2024-03-10', result: 'Неудовлетворительно' }
  ],
  costs: [
    { item: 'Расход 1', amount: 1000, currency: 'USD' },
    { item: 'Расход 2', amount: 500, currency: 'EUR' }
  ],
  orders: [
    { customer: 'Заказчик 1', product: 'Продукт 1', quantity: 10 },
    { customer: 'Заказчик 2', product: 'Продукт 2', quantity: 20 }
  ]
};
