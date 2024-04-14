<?php
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

$processId = $_POST['processId'];

$sql = "DELETE FROM processes WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $processId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>