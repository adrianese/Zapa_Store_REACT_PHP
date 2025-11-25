<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $productos = $data->productos;

    $log = fopen("stock_update.log", "a");
    fwrite($log, "Request received: " . json_encode($data) . "\n");

    foreach ($productos as $producto) {
        $id_producto = $conn->real_escape_string($producto->id_producto);
        $talle = $conn->real_escape_string($producto->talle);
        $cantidad = $conn->real_escape_string($producto->cantidad);

        $sql = "UPDATE producto_talles SET stock = stock - $cantidad WHERE id_producto = $id_producto AND talle = $talle";
        fwrite($log, "Executing query: " . $sql . "\n");

        if ($conn->query($sql) !== TRUE) {
            fwrite($log, "Query failed: " . $conn->error . "\n");
            http_response_code(500);
            echo json_encode(["message" => "Error al actualizar el stock: " . $conn->error]);
            fclose($log);
            return;
        }
    }

    fwrite($log, "Stock updated successfully.\n");
    fclose($log);

    http_response_code(200);
    echo json_encode(["message" => "Stock actualizado con éxito."]);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido."]);
}
?>
