<?php
// Подключение к базе данных
$servername = "localhost";
$username_db = "root";
$password_db = "admin";
$dbname = "login";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
  die("Ошибка подключения: " . $conn->connect_error);
}

// Обработка запроса POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получение и обновление данных о процессе
    $processId = $_POST['edit-process-id'];
    $processName = $_POST['edit-process-name'];
    $processStartDate = $_POST['edit-process-startDate'];
    $processEndDate = $_POST['edit-process-endDate'];
    $processParticipants = $_POST['edit-process-participants'];
    $processDevelopmentStage = $_POST['edit-process-developmentStage'];

    // Подготовка и выполнение запроса на обновление данных
    $stmt = $conn->prepare("UPDATE processes SET name = ?, start_date = ?, end_date = ?, participants = ?, development_stage = ? WHERE id = ?");

    // Установка типов данных для параметров
    $stmt->bind_param("sssssi", $processName, $processStartDate, $processEndDate, $processParticipants, $processDevelopmentStage, $processId);

    // Запуск транзакции
    $conn->begin_transaction();

    // Выполнение обновления
    if ($stmt->execute()) {
        $stmt->close();
        $conn->commit();
        echo json_encode(["success" => true]);
        header("Location: index.php");
    } else {
        $conn->rollback();
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    // Получение данных о процессе по его ID
    $processId = $_GET['id'];
    $stmt = $conn->prepare("SELECT * FROM processes WHERE id = ?");
    $stmt->bind_param("i", $processId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["success" => false, "error" => "Process not found"]);
    }

    $stmt->close();
}

$conn->close();
?>