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
            }
        });
    });

    const logoutLink = document.querySelector('a[href="?logout=true"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвратить переход по ссылке
            if (confirm('Вы уверены, что хотите выйти?')) {
                window.location.href = this.href; // Перенаправить на выход
            }
        });
    }

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
            } else {
                alert('Ошибка при обновлении процесса');
            }
        })
        .catch(error => console.error('Ошибка:', error));
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
});