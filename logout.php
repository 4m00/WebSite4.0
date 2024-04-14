<?php
session_start();

// Удаляем сеанс пользователя
session_unset();
session_destroy();

// Перенаправляем на страницу входа
header("Location: login.php");
exit();
?>