<?php
session_start();

if (isset($_SESSION['user_id'])) {
  header("Location: index.php");
  exit();
}

$servername = "localhost";
$username_db = "root";
$password_db = "admin";
$dbname = "login";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$error_message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $username = $conn->real_escape_string($_POST['username']);
  $password = $_POST['password'];

  // Изменен запрос для выборки пароля из базы данных
  $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username=?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    // Сравнение введенного пароля с паролем из базы данных
    if ($password === $row['password']) {
      $_SESSION['user_id'] = $row['id'];
      $_SESSION['username'] = $row['username'];
      header("Location: index.php");
      exit();
    } else {
      $error_message = "Неправильное имя пользователя или пароль!";
    }
  } else {
    $error_message = "Неправильное имя пользователя или пароль!";
  }

  $stmt->close();
  $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css" />
  <title>Логин</title>
</head>
<body>
  <h2>Вход</h2>
  <?php if (!empty($error_message)) { ?>
    <p><?php echo $error_message; ?></p>
  <?php } ?>
  <form action="" method="post">
    <label for="username">Имя пользователя:</label>
    <input type="text" id="username" name="username" required><br><br>
    <label for="password">Пароль:</label>
    <input type="password" id="password" name="password" required><br><br>
    <button type="submit">Войти</button>
  </form>
</body>
</html>