<?php //db.php

$host = "localhost";
$user = "root";
$pass = "0077";
$db   = "store_crud_php";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
