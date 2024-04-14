<?php
session_start();

// Проверка на авторизацию пользователя
if (!isset($_SESSION['user_id'])) {
  header("Location: login.php");
  exit();
}

// Обработка запроса на выход
if (isset($_GET['logout']) && $_GET['logout'] == 'true') {
  session_unset();
  session_destroy();
  header("Location: login.php");
  exit();
}

$current_page = basename($_SERVER['PHP_SELF']);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Производственная платформа</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <link rel="stylesheet" href="styles.css" />
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <i class="fas fa-industry"></i>
                <h1>Цифровая платформа</h1>
            </div>
            <ul id="nav-menu" class="menu">
                <li><a href="#" data-link="current-processes">Текущие процессы</a></li>
                <li><a href="#" data-link="add-process">Добавить процесс</a></li>
                <li><a href="#" data-link="all-processes">Все процессы</a></li>
                <li><a href="#" data-link="process-visualization">Визуализация процессов</a></li>
                <li><a href="?logout=true">Выйти</a></li>
            </ul>
        </nav>
    </header>
    <main>
    <section id="app-section">
      <section id="current-processes-section" style="display: none">
        <h2>Текущие процессы</h2>
        <ul id="current-process-list"></ul>
      </section>
      <section id="add-process-section" style="display: none">
        <h2>Добавить процесс</h2>
        <form action="add_process.php" method="post">
            <label for="process-name">Название процесса:</label>
            <input type="text" id="process-name" name="process-name" required><br><br>
            <label for="process-startDate">Дата начала:</label>
            <input type="date" id="process-startDate" name="process-startDate" required><br><br>
            <label for="process-endDate">Дата окончания (необязательно):</label>
            <input type="date" id="process-endDate" name="process-endDate"><br><br>
            <label for="process-participants">Участники (через запятую):</label>
            <input type="text" id="process-participants" name="process-participants"><br><br>
            <label for="process-developmentStage">Этап разработки:</label>
            <select id="process-developmentStage" name="process-developmentStage">
              <option value="Планирование">Планирование</option>
              <option value="Разработка">Разработка</option>
              <option value="Тестирование">Тестирование</option>
              <option value="Внедрение">Внедрение</option>
            </select><br><br>
            <button type="submit">Добавить процесс</button>
        </form>
      </section>
      <section id="edit-process-section" style="display: none">
        <h2>Изменить процесс</h2>
        <form action="edit_process.php" method="post" id="edit-process-form">
          <input type="hidden" name="edit-process-id" id="edit-process-id" value="">
          <label for="edit-process-name">Название процесса:</label>
          <input type="text" id="edit-process-name" name="edit-process-name" required><br><br>
          <label for="edit-process-startDate">Дата начала:</label>
          <input type="date" id="edit-process-startDate" name="edit-process-startDate" required><br><br>
          <label for="edit-process-endDate">Дата окончания (необязательно):</label>
          <input type="date" id="edit-process-endDate" name="edit-process-endDate"><br><br>
          <label for="edit-process-participants">Участники (через запятую):</label>
          <input type="text" id="edit-process-participants" name="edit-process-participants"><br><br>
          <label for="edit-process-developmentStage">Этап разработки:</label>
          <select id="edit-process-developmentStage" name="edit-process-developmentStage">
              <option value="Планирование">Планирование</option>
              <option value="Разработка">Разработка</option>
              <option value="Тестирование">Тестирование</option>
              <option value="Внедрение">Внедрение</option>
          </select><br><br>
          <button type="submit">Изменить процесс</button>
      </form>
      </section>
      <section id="all-processes-section" style="display: none">
        <h2>Все процессы</h2>
        <ul id="process-list"></ul>
      </section>
      <section id="process-visualization-section" style="display: none">
        <h2>Визуализация процессов</h2>
        <div id="process-visualization"></div>
      </section>
    </section>
  </main>
  <footer>
    <div class="copyright">
      <p>&copy; 2024 Производственная платформа</p>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>