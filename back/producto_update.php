<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

require __DIR__ . '/../vendor/autoload.php';
use Intervention\Image\ImageManagerStatic as Image;
Image::configure(['driver' => 'gd']);

$upload_dir = __DIR__ . "/../uploads/productos/";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_producto   = $_POST['id_producto'] ?? 0;
    $marca         = $_POST['marca'] ?? '';
    $modelo        = $_POST['modelo'] ?? '';
    $actividad     = $_POST['actividad'] ?? '';
    $disponible    = isset($_POST['disponible']) ? (int)$_POST['disponible'] : 0;
    $precio        = $_POST['precio'] ?? 0;

    if ($id_producto == 0) {
        echo json_encode(["error" => true, "message" => "ID de producto faltante."]);
        exit;
    }

    $update_imagen = false;
    $imagen_nombre = null;

    // Buscar imagen actual en BD
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

    // Procesar imagen si se subió una nueva
    if (isset($_FILES['imagen_file']) && $_FILES['imagen_file']['error'] === UPLOAD_ERR_OK) {
        $file_tmp_path = $_FILES['imagen_file']['tmp_name'];
        $extension     = pathinfo($_FILES['imagen_file']['name'], PATHINFO_EXTENSION);

        // Generar nombre único
        $imagen_nombre = uniqid("prod_") . "." . $extension;
        $dest_path     = $upload_dir . $imagen_nombre;

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        try {
            $image = Image::make($file_tmp_path);
            $image->save($dest_path);
            $update_imagen = true;

            //  Eliminar imagen anterior si existe
            if ($current_img && $current_img !== $imagen_nombre) {
                $old_path = $upload_dir . $current_img;
                if (file_exists($old_path)) {
                    unlink($old_path);
                }
            }
        } catch (Exception $e) {
            echo json_encode(["error" => true, "message" => "Error al procesar la imagen: " . $e->getMessage()]);
            exit;
        }
    }

    //  Construir consulta UPDATE
    $sql_parts   = [];
    $bind_types  = "";
    $bind_values = [];

    $sql_parts[] = "marca = ?";
    $bind_types .= "s";
    $bind_values[] = &$marca;

    $sql_parts[] = "modelo = ?";
    $bind_types .= "s";
    $bind_values[] = &$modelo;

    $sql_parts[] = "actividad = ?";
    $bind_types .= "s";
    $bind_values[] = &$actividad;

    $sql_parts[] = "disponible = ?";
    $bind_types .= "i";
    $bind_values[] = &$disponible;

    $sql_parts[] = "precio = ?";
    $bind_types .= "d";
    $bind_values[] = &$precio;

    if ($update_imagen) {
        $sql_parts[] = "imagen = ?";
        $bind_types .= "s";
        $bind_values[] = &$imagen_nombre;
    }

    $bind_types .= "i";
    $bind_values[] = &$id_producto;

    $sql = "UPDATE productos SET " . implode(", ", $sql_parts) . " WHERE id_producto = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(["error" => true, "message" => "Error en la preparación de la consulta: " . $conn->error]);
        exit;
    }

    call_user_func_array([$stmt, 'bind_param'], array_merge([$bind_types], $bind_values));

    if ($stmt->execute()) {
        echo json_encode([
            "message" => "Producto actualizado con éxito.",
            "imagen"  => $imagen_nombre ?? $current_img // devolver nombre final
        ]);
    } else {
        echo json_encode(["error" => true, "message" => "Error al actualizar el producto en BD: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => true, "message" => "Método no permitido."]);
}
