<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

// ✅ Ruta absoluta en disco
$upload_dir = realpath(__DIR__ . "/../public/uploads/productos") . "/";

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->id_producto)) {
        $id_producto = (int)$data->id_producto;

        // 1️⃣ Buscar imagen actual en BD
        $sql_img = "SELECT imagen FROM productos WHERE id_producto = ?";
        $stmt_img = $conn->prepare($sql_img);
        $stmt_img->bind_param("i", $id_producto);
        $stmt_img->execute();
        $result_img = $stmt_img->get_result();
        $current_img = null;
        if ($row = $result_img->fetch_assoc()) {
            $current_img = $row['imagen'];
        }
        $stmt_img->close();

        // 2️⃣ Borrar talles asociados
        $sql_talles = "DELETE FROM producto_talles WHERE id_producto = ?";
        $stmt_talles = $conn->prepare($sql_talles);
        $stmt_talles->bind_param("i", $id_producto);
        if ($stmt_talles->execute()) {
            $stmt_talles->close();

            // 3️⃣ Borrar producto
            $sql_producto = "DELETE FROM productos WHERE id_producto = ?";
            $stmt_producto = $conn->prepare($sql_producto);
            $stmt_producto->bind_param("i", $id_producto);
            if ($stmt_producto->execute()) {
                $stmt_producto->close();

                // 4️⃣ Eliminar imagen del disco si existe
                if ($current_img) {
                    $old_path = $upload_dir . $current_img;
                    if (file_exists($old_path)) {
                        if (!unlink($old_path)) {
                            error_log("No se pudo borrar la imagen: $old_path");
                        }
                    } else {
                        error_log("Imagen no encontrada: $old_path");
                    }
                }

                echo json_encode(["message" => "Producto eliminado con éxito."]);
            } else {
                echo json_encode(["error" => true, "message" => "Error al eliminar el producto: " . $stmt_producto->error]);
            }
        } else {
            echo json_encode(["error" => true, "message" => "Error al eliminar los talles del producto: " . $stmt_talles->error]);
        }
    } else {
        echo json_encode(["error" => true, "message" => "ID de producto no proporcionado."]);
    }
} else {
    echo json_encode(["error" => true, "message" => "Método no permitido."]);
}
?>