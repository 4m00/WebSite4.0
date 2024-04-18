document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sections = document.querySelectorAll('#app-section > section');
            sections.forEach(section => section.style.display = 'none');
            const targetSection = document.querySelector(`#${this.dataset.link}-section`);
            targetSection.style.display = 'block';
            if (this.dataset.link === 'current-processes') {
                loadCurrentProcesses();
            } else if (this.dataset.link === 'all-processes') {
                loadAllProcesses();
            } else if (this.dataset.link === 'process-visualization') {
                loadProcessVisualization(); // Load process visualization
            }
        });
    });

    const processForm = document.getElementById('process-form');
    if (processForm) {
        processForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('add_process.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Процесс успешно добавлен.');
                    loadAllProcesses(); // Обновить список всех процессов
                } else {
                    alert('Ошибка при добавлении процесса.');
                }
            })
            .catch(error => console.error('Ошибка:', error));
        });
    }

    function loadCurrentProcesses() {
        loadProcesses('get_current_processes.php', 'current-process-list');
    }

    function loadAllProcesses() {
        loadProcesses('get_all_processes.php', 'process-list');
    }

    function loadProcesses(url, targetId) {
        const processListElement = document.getElementById(targetId);
        processListElement.innerHTML = '';
        fetch(url)
            .then(response => response.text())
            .then(data => {
                processListElement.innerHTML = data;
                // Назначаем обработчики событий на кнопки "Редактировать" и "Удалить"
                const editButtons = document.querySelectorAll('.edit-button');
                editButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const processId = this.dataset.processId;
                        editProcessForm(processId);
                    });
                });
                const deleteButtons = document.querySelectorAll('.delete-button');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const processId = this.dataset.processId;
                        deleteProcess(processId);
                    });
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке процессов:', error);
                processListElement.innerHTML = `<li>Ошибка при загрузке процессов: ${error}</li>`;
            });
    }

    function submitEditForm() {
        const formData = new FormData(document.getElementById('edit-process-form'));
        fetch('edit_process.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Перенаправляем пользователя на index.php после успешного обновления процесса
                window.location.href = 'index.php';
                alert('Процесс успешно изменен.');
            } else {
                alert('Ошибка при обновлении процесса');
            }
        })
        .catch(error => console.error('Ошибка:', error))
        .finally(() => {
            // Закрываем форму редактирования после успешного изменения процесса
            document.getElementById('edit-process-section').style.display = 'none';
        });
    }

    function deleteProcess(processId) {
        if (!confirm('Вы уверены, что хотите удалить этот процесс?')) {
            return;
        }
        fetch('delete_process.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `processId=${processId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Процесс удален успешно.');
                loadCurrentProcesses(); // Обновить список текущих процессов
                location.reload(); // Добавлена строка для перезагрузки страницы
            } else {
                console.error('Ошибка при удалении процесса:', data.error);
            }
        })
        .catch(error => console.error('Ошибка:', error));
    }

    function editProcessForm(processId) {
        fetch(`edit_process.php?id=${processId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success === false) {
                    console.error('Ошибка при получении данных о процессе:', data.error);
                    return;
                }
                // Заполняем форму данными о процессе
                document.getElementById('edit-process-id').value = processId;
                document.getElementById('edit-process-name').value = data.name || '';
                document.getElementById('edit-process-startDate').value = data.start_date || '';
                document.getElementById('edit-process-endDate').value = data.end_date || '';
                document.getElementById('edit-process-participants').value = data.participants || '';
                document.getElementById('edit-process-developmentStage').value = data.development_stage || '';
                // Показываем форму редактирования
                const sections = document.querySelectorAll('#app-section > section');
                sections.forEach(section => section.style.display = 'none');
                document.getElementById('edit-process-section').style.display = 'block';
            })
            .catch(error => console.error('Ошибка при получении данных о процессе:', error));
    }

    // Добавим обработчик для формы редактирования
    const editProcessFormElement = document.getElementById('edit-process-form');
    if (editProcessFormElement) {
        editProcessFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEditForm();
        });
    }

    // Добавим обработчик для кнопки "Добавить процесс" на странице добавления процесса
    const addProcessForm = document.getElementById('add-process-form');
    if (addProcessForm) {
        addProcessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('add_process.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Процесс успешно добавлен.');
                    loadAllProcesses(); // Обновить список всех процессов
                } else {
                    alert('Ошибка при добавлении процесса.');
                }
            })
            .catch(error => console.error('Ошибка:', error));
        });
    }

    // Function to load process visualization
    function loadProcessVisualization() {
        fetch('get_visualisation_processes.php')
            .then(response => response.text())
            .then(data => {
                const processVisualizationContainer = document.getElementById('process-visualization-container');
                processVisualizationContainer.innerHTML = data;
                addCardClickHandlers();
            })
            .catch(error => console.error('An error occurred while loading process visualization:', error));
    }

    function addCardClickHandlers() {
        const processCards = document.querySelectorAll('.process-card');
        processCards.forEach(card => {
            card.addEventListener('click', () => {
                const processId = card.dataset.processId;
                openProcessDetails(processId);
            });
        });
    }

    function openProcessDetails(processId) {
        fetch(`get_process_details.php?id=${processId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const visualizationContainer = document.getElementById('process-visualization-container');
                    visualizationContainer.innerHTML = '';

                    const processDetails = `
                        <div class="process-details-modal">
                            <div class="process-details-content">
                                <span class="close-details">&times;</span>
                                <h3 class="process-name">${data.name}</h3>
                                <p class="process-date"><strong>Дата начала:</strong> ${data.start_date}</p>
                                <p class="process-date"><strong>Дата окончания:</strong> ${data.end_date || 'Не указана'}</p>
                                <p class="process-participants"><strong>Участники:</strong> ${data.participants}</p>
                                <p class="process-stage"><strong>Этап разработки:</strong> ${data.development_stage}</p>
                            </div>
                        </div>
                    `;
                    visualizationContainer.innerHTML = processDetails;

                    document.querySelector('.close-details').addEventListener('click', () => {
                        visualizationContainer.innerHTML = '';
                        loadProcessVisualization();
                    });
                } else {
                    console.error('Error fetching process details:', data.error);
                    alert('Не удалось загрузить данные о процессе.');
                }
            })
            .catch(error => console.error('Error loading process data:', error));
    }

    function toggleModal() {
        const modal = document.getElementById('process-details-modal');
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    }

    document.addEventListener('click', function(e) {
        const modal = document.getElementById('process-details-modal');
        if (e.target === modal) {
            toggleModal();
        }
    });
});