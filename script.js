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

// Обработчик события для формы добавления/редактирования процесса
document.getElementById('process-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const processName = document.getElementById('process-name').value;
  const processStartDate = document.getElementById('process-startDate').value;
  const processEndDate = document.getElementById('process-endDate').value || '';

  // Проверка даты окончания процесса
  if (processEndDate && new Date(processEndDate) < new Date(processStartDate)) {
      alert('Дата окончания процесса не может быть раньше даты начала');
      return;
  }

  const newProcess = {
      name: processName,
      startDate: processStartDate,
      endDate: processEndDate,
      participants: [], // Добавьте возможность указывать участников, если требуется
      developmentStage: '' // Добавьте возможность указывать этап разработки, если требуется
  };

  if (currentEditingProcessIndex !== null) {
      // Обновляем существующий процесс
      database.processes[currentEditingProcessIndex] = newProcess;
      currentEditingProcessIndex = null; // Сбрасываем индекс после обновления
  } else {
      // Добавляем новый процесс
      database.processes.push(newProcess);
  }

  renderProcessList(); // Перерисовываем список процессов
  document.getElementById('process-form').reset(); // Сбрасываем форму
  showSection('current-processes'); // Возвращаем пользователя к списку текущих процессов
});

// Функция для редактирования процесса
function editProcess(index) {
    const process = database.processes[index];
    // Заполняем форму данными процесса
    document.getElementById('process-name').value = process.name;
    document.getElementById('process-startDate').value = process.startDate;
    document.getElementById('process-endDate').value = process.endDate || '';
    currentEditingProcessIndex = index; // Сохраняем индекс редактируемого процесса
    showSection('add-process'); // Показываем форму
}

// Функция для отображения списка процессов с обновленными кнопками редактирования и удаления
function renderProcessList() {
    const processListElement = document.getElementById('process-list');
    processListElement.innerHTML = ''; // Очищаем список

    database.processes.forEach((process, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${process.name} (${process.startDate} - ${process.endDate || 'Открытая'})`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.onclick = () => editProcess(index); // Назначаем функцию редактирования

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = () => {
            removeProcess(index); // Удаляем процесс
            renderProcessList(); // Перерисовываем список
        };

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        processListElement.appendChild(listItem);
    });
}

// Функция удаления процесса
function removeProcess(index) {
    database.processes.splice(index, 1);
}


// Функция для обновления процесса
function updateProcess(index) {
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
    const updatedProcess = {
      name: processName,
      startDate: processStartDate,
      endDate: processEndDate,
      participants: processParticipants,
      developmentStage: processDevelopmentStage
    };
    database.processes[index] = updatedProcess;
    renderProcessList();
    // Здесь вы можете закрыть форму редактирования процесса
  } else {
    alert('Заполните все обязательные поля формы');
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
    processForm.reset();
  } else {
    alert('Заполните все обязательные поля формы');
  }
}

// Функция для просмотра процесса
function viewProcess(index) {
  const process = database.processes[index];
  alert(`Название: ${process.name}\nДата начала: ${process.startDate}\nДата окончания: ${process.endDate || 'Открытая'}\nУчастники: ${process.participants.join(', ')}\nЭтап разработки: ${process.developmentStage}`);
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
