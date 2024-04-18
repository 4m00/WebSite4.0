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

$processes = [];
if ($result_all->num_rows > 0) {
    while ($row_all = $result_all->fetch_assoc()) {
        $processes[] = $row_all;
    }
}

$conn->close();

$stages = ['Планирование', 'Разработка', 'Тестирование', 'Внедрение'];

foreach ($stages as $stage) {
    // Преобразование названия этапа в класс CSS
    $stageClass = 'stage-' . str_replace(' ', '-', $stage); // Заменяем пробелы на дефисы для соответствия с классами CSS

    echo "<div class='process-stage-container'>";
    echo "<div class='process-stage-header'>";
    echo "<i class='fas fa-clipboard-list'></i>";
    echo "<h3>$stage</h3>";
    echo "</div>";
    echo "<div class='process-stage-content'>";
    echo "<div class='process-card-container' id='{$stageClass}-stage'>";

    foreach ($processes as $process) {
        if ($process['development_stage'] == $stage) {
            echo "<div class='process-card' data-process-id='{$process['id']}'>";
            echo "<h4>{$process['name']}</h4>";
            echo "<p>Этап: {$process['development_stage']}</p>";
            echo "</div>";
        }
    }

    echo "</div>"; // Закрываем process-card-container
    echo "</div>"; // Закрываем process-stage-content
    echo "</div>"; // Закрываем process-stage-container
}

if (empty($processes)) {
    echo '<p>Процессы не найдены.</p>';
}
?>