<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";
require __DIR__ . '/../vendor/autoload.php';

use Intervention\Image\ImageManagerStatic as Image;
// Forzar GD en InfinityFree
Image::configure(['driver' => 'gd']);


$upload_dir = __DIR__ . "/../public/uploads/productos/";

// Creo carpeta si no existe
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $marca = $_POST['marca'] ?? '';
    $modelo = $_POST['modelo'] ?? '';
    $actividad = $_POST['actividad'] ?? '';
    $disponible = isset($_POST['disponible']) ? (int)$_POST['disponible'] : 0;
    $precio = $_POST['precio'] ?? 0;
    $imagen_nombre = $_POST['imagen_nombre'] ?? '';

    if (!isset($_FILES['imagen_file']) || $_FILES['imagen_file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["error" => true, "message" => "Debe seleccionar una imagen para crear un producto."]);
        exit;
    }

    $file_tmp_path = $_FILES['imagen_file']['tmp_name'];

    // Validar que realmente sea una imagen
    $info = getimagesize($file_tmp_path);
    if ($info === false) {
        echo json_encode(["error" => true, "message" => "El archivo subido no es una imagen válida."]);
        exit;
    }

    // Procesar con Intervention
    $image = Image::make($file_tmp_path);

    // Mantener formato original
    $extension = pathinfo($imagen_nombre, PATHINFO_EXTENSION);
    $dest_path = $upload_dir . $imagen_nombre;

    // Guardar imagen
    $image->save($dest_path);

    // Insertar en BD
    $sql = "INSERT INTO productos (marca, modelo, imagen, actividad, disponible, precio)
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["error" => true, "message" => "Error al preparar la consulta: " . $conn->error]);
        exit;
    }
    $stmt->bind_param("ssssdi", $marca, $modelo, $imagen_nombre, $actividad, $disponible, $precio);

    if ($stmt->execute()) {
        echo json_encode([
            "message" => "Producto creado con éxito.",
            "id_producto" => $stmt->insert_id
        ]);
    } else {
        echo json_encode(["error" => true, "message" => "Error al crear el producto: " . $stmt->error]);
    }

    $stmt->close();

} else {
    echo json_encode(["error" => true, "message" => "Método no permitido."]);
}