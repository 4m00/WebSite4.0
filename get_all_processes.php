<?php
// Подключение к базе данных
$servername = "localhost";
$username_db = "root";
$password_db = "admin";
$dbname = "login";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Запрос на получение всех процессов
$sql_all = "SELECT * FROM processes";

$result_all = $conn->query($sql_all);

if ($result_all->num_rows > 0) {
    // Вывод всех процессов
    while ($row_all = $result_all->fetch_assoc()) {
        echo '<li>';
        echo '<p>Название: ' . $row_all['name'] . '</p>';
        echo '<p>Дата начала: ' . $row_all['start_date'] . '</p>';
        echo '<p>Дата окончания: ' . $row_all['end_date'] . '</p>';
        echo '<p>Участники: ' . $row_all['participants'] . '</p>';
        echo '<p>Этап разработки: ' . $row_all['development_stage'] . '</p>';
        echo "<button class='edit-button' data-process-id='{$row_all['id']}'>Редактировать</button>";
        echo "<button class='delete-button' data-process-id='{$row_all['id']}'>Удалить</button>";
        echo '</li>';
    }
} else {
    echo 'Процессы не найдены.';
}

$conn->close();
?>