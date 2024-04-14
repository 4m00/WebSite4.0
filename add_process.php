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

// Получение данных из формы
$processName = $_POST['process-name'];
$processStartDate = $_POST['process-startDate'];
$processEndDate = $_POST['process-endDate'];
$processParticipants = $_POST['process-participants'];
$processDevelopmentStage = $_POST['process-developmentStage'];

// Проверка на существование процесса
$stmt = $conn->prepare("SELECT * FROM processes WHERE name = ?");
$stmt->bind_param("s", $processName);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $stmt->close();
    $conn->close();
    header("Location: index.php"); // Переход на index.php
    exit();
} else {
    // Подготовка и выполнение запроса на вставку данных
    $stmt = $conn->prepare("INSERT INTO processes (name, start_date, end_date, participants, development_stage) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $processName, $processStartDate, $processEndDate, $processParticipants, $processDevelopmentStage);

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        header("Location: index.php"); // Переход на index.php
        exit();
    } else {
        echo "Ошибка при добавлении процесса: " . $stmt->error;
    }
}

$stmt->close();
$conn->close();
?>
