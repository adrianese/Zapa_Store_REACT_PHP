<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

// Función para armar producto con talles
function buildProducto($row) {
    return [
        "id_producto" => $row['id_producto'],
        "marca"       => $row['marca'],
        "modelo"      => $row['modelo'],
        "imagen"      => $row['imagen'],
        "actividad"   => $row['actividad'],
        "disponible"  => (bool)$row['disponible'],
        "precio"      => $row['precio'],
        "talles"      => []
    ];
}

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];

    $sql = "SELECT p.id_producto, p.marca, p.modelo, p.imagen, p.actividad, p.disponible, p.precio,
                   t.talle, t.stock
            FROM productos p
            LEFT JOIN producto_talles t ON p.id_producto = t.id_producto
            WHERE p.id_producto = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    $producto = null;
    while ($row = $result->fetch_assoc()) {
        if ($producto === null) {
            $producto = buildProducto($row);
        }
        if ($row['talle'] !== null) {
            $producto["talles"][] = [
                "talle" => (int)$row['talle'],
                "stock" => (int)$row['stock']
            ];
        }
    }
    $stmt->close();

    echo json_encode($producto);

} else {
    $sql = "SELECT p.id_producto, p.marca, p.modelo, p.imagen, p.actividad, p.disponible, p.precio,
                   t.talle, t.stock
            FROM productos p
            LEFT JOIN producto_talles t ON p.id_producto = t.id_producto
            ORDER BY p.id_producto";

    $result = $conn->query($sql);

    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $id = $row['id_producto'];

        if (!isset($productos[$id])) {
            $productos[$id] = buildProducto($row);
        }
        if ($row['talle'] !== null) {
            $productos[$id]["talles"][] = [
                "talle" => (int)$row['talle'],
                "stock" => (int)$row['stock']
            ];
        }
    }

    echo json_encode(array_values($productos));
}
?>