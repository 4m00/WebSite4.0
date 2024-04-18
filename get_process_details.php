<?php
// Подключение к базе данных
$servername = "localhost";
$username_db = "root";
$password_db = "admin";
$dbname = "login";

// Создаем соединение
$conn = new mysqli($servername, $username_db, $password_db, $dbname);

// Проверяем соединение
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Получаем ID процесса из запроса
$processId = isset($_GET['id']) ? $_GET['id'] : '';

// Подготавливаем и выполняем запрос к базе данных
$sql = "SELECT * FROM processes WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $processId);
$stmt->execute();
$result = $stmt->get_result();

$response = [];

// Проверяем, есть ли результат
if ($result->num_rows > 0) {
    // Получаем данные процесса и отправляем их
    $response = $result->fetch_assoc();
    $response['success'] = true;
} else {
    // Если процесс не найден, отправляем сообщение об ошибке
    $response['success'] = false;
    $response['error'] = "Процесс не найден.";
}

// Закрываем соединение
$stmt->close();
$conn->close();

// Устанавливаем заголовок ответа как JSON
header('Content-Type: application/json');
echo json_encode($response);
?>