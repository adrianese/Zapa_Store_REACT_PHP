<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

if (isset($_GET['id_usuario'])) {
    $id_usuario = $conn->real_escape_string($_GET['id_usuario']);
    $sql = "SELECT 
                p.id_pedido, p.fecha, p.total, p.estado, p.factura,
                pd.talle, pd.cantidad, pd.precio,
                pr.marca, pr.modelo, pr.imagen
            FROM pedidos p
            JOIN pedido_detalle pd ON p.id_pedido = pd.id_pedido
            JOIN productos pr ON pd.id_producto = pr.id_producto
            WHERE p.id_usuario = $id_usuario
            ORDER BY p.fecha DESC, p.id_pedido";
} else {
    $sql = "SELECT 
                p.id_pedido, p.fecha, p.total, p.estado, p.factura,
                u.nombre AS cliente, u.email,
                pd.talle, pd.cantidad, pd.precio,
                pr.marca, pr.modelo, pr.imagen
            FROM pedidos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN pedido_detalle pd ON p.id_pedido = pd.id_pedido
            JOIN productos pr ON pd.id_producto = pr.id_producto
            ORDER BY p.fecha DESC, p.id_pedido";
}

$result = $conn->query($sql);

$pedidos = [];

while ($row = $result->fetch_assoc()) {
    $id_pedido = $row['id_pedido'];

    if (!isset($pedidos[$id_pedido])) {
        $pedidos[$id_pedido] = [
            "id_pedido"   => $row['id_pedido'],
            "fecha"       => $row['fecha'],
            "total"       => $row['total'],
            "estado"      => $row['estado'],
            "factura"     => $row['factura'],
            "productos"   => []
        ];
        if (isset($row['cliente'])) {
            $pedidos[$id_pedido]['cliente'] = $row['cliente'];
            $pedidos[$id_pedido]['email'] = $row['email'];
        }
    }

    $pedidos[$id_pedido]['productos'][] = [
        "marca"    => $row['marca'],
        "modelo"   => $row['modelo'],
        "imagen"   => $row['imagen'],
        "talle"    => $row['talle'],
        "cantidad" => $row['cantidad'],
        "precio"   => $row['precio']
    ];
}

echo json_encode(array_values($pedidos));
?>
