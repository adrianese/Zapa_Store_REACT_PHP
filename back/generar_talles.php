<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

// Leer JSON desde el body
$input = json_decode(file_get_contents("php://input"), true);

$id_producto = $input['id_producto'] ?? 0;
$talles = $input['talles'] ?? [];

if ($id_producto == 0 || empty($talles)) {
    echo json_encode(["error" => true, "message" => "Datos incompletos"]);
    exit;
}

// ✅ Usamos INSERT ... ON DUPLICATE KEY UPDATE
// Asegúrate de tener una UNIQUE KEY en la tabla: (id_producto, talle)
$sql = "INSERT INTO producto_talles (id_producto, talle, stock) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE stock = VALUES(stock)";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(["error" => true, "message" => "Error al preparar la consulta: " . $conn->error]);
    exit;
}

foreach ($talles as $t) {
    $talle = (int)$t['talle'];
    $stock = (int)$t['stock'];
    $stmt->bind_param("iii", $id_producto, $talle, $stock);
    $stmt->execute();
}

$stmt->close();

echo json_encode([
    "message" => "Talles actualizados con éxito",
    "id_producto" => $id_producto
]);
?>