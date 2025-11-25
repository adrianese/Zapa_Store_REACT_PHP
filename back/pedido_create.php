<?php //pedido_create.php
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

    $id_usuario = $conn->real_escape_string($data->id_usuario);
    $total = $conn->real_escape_string($data->total);
    $productos = $data->productos;

    // Generate a unique order ID
    $id_pedido = uniqid('PED-');
    $fecha = date('Y-m-d');
    $estado = 'pendiente'; // Default state

    // Insert into pedidos table
    $sql_pedido = "INSERT INTO pedidos (id_pedido, id_usuario, fecha, total, estado) VALUES ('$id_pedido', $id_usuario, '$fecha', $total, '$estado')";

    if ($conn->query($sql_pedido) === TRUE) {
        // Insert into pedido_detalle table
        foreach ($productos as $producto) {
            $id_producto = $conn->real_escape_string($producto->id_producto);
            $talle = $conn->real_escape_string($producto->talle);
            $cantidad = $conn->real_escape_string($producto->cantidad);
            $precio = $conn->real_escape_string($producto->precio);

            $sql_detalle = "INSERT INTO pedido_detalle (id_pedido, id_producto, talle, cantidad, precio) VALUES ('$id_pedido', $id_producto, $talle, $cantidad, $precio)";
            
            if ($conn->query($sql_detalle) !== TRUE) {
                // Handle error and potentially roll back the transaction
                http_response_code(500);
                echo json_encode(["message" => "Error al guardar el detalle del pedido: " . $conn->error]);
                return;
            }
        }
        http_response_code(201);
        echo json_encode(["message" => "Pedido creado con éxito.", "id_pedido" => $id_pedido]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al crear el pedido: " . $conn->error]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido."]);
}
?>
