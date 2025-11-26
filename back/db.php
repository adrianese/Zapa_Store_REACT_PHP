<?php
// db.php para InfinityFree

$host = "sql100.infinityfree.com";
$user = "if0_40468058";
$pass = "ZOm3ZbvrZPaGQ";
$db   = "if0_40468058_zapa_store_react";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}
?>