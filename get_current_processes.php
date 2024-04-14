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

// Запрос на получение текущих процессов
$sql_current = "SELECT * FROM processes WHERE end_date >= CURDATE() AND start_date <= CURDATE()";

$result_current = $conn->query($sql_current);

if ($result_current->num_rows > 0) {
    // Вывод текущих процессов
    while ($row_current = $result_current->fetch_assoc()) {
        echo '<li>';
        echo '<p>Название: ' . $row_current['name'] . '</p>';
        echo '<p>Дата начала: ' . $row_current['start_date'] . '</p>';
        echo '<p>Дата окончания: ' . $row_current['end_date'] . '</p>';
        echo '<p>Участники: ' . $row_current['participants'] . '</p>';
        echo '<p>Этап разработки: ' . $row_current['development_stage'] . '</p>';
        echo "<button class='edit-button' data-process-id='{$row_current['id']}'>Редактировать</button>";
        echo "<button class='delete-button' data-process-id='{$row_current['id']}'>Удалить</button>";
        echo '</li>';
    }
} else {
    echo 'Текущие процессы не найдены.';
}

$conn->close();
?>