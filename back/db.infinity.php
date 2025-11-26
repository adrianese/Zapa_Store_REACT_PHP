<?php
// db.php para InfinityFree 
// Cambiar a nombre db.php el archivo
//Cargar las credenciales

$host = "DB_HOST";
$user = "DB_USER";
$pass = "DB_PASS";
$db   = "DB_NAME";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}
?>