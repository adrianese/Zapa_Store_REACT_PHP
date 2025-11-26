<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";


$upload_dir = $_SERVER['DOCUMENT_ROOT'] . "/public/uploads/productos/";

// Crear carpeta si no existe
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Datos enviados por FormData
    $marca = $_POST['marca'] ?? '';
    $modelo = $_POST['modelo'] ?? '';
    $actividad = $_POST['actividad'] ?? '';
    $disponible = isset($_POST['disponible']) ? (int)$_POST['disponible'] : 0;
    $precio = $_POST['precio'] ?? 0;
    $imagen_nombre = $_POST['imagen_nombre'] ?? '';

    // Validación: si se crea y no llega imagen → error
    if (!isset($_FILES['imagen_file']) || $_FILES['imagen_file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["error" => true, "message" => "Debe seleccionar una imagen para crear un producto."]);
        exit;
    }

    // Procesar archivo
    $file_tmp_path = $_FILES['imagen_file']['tmp_name'];

    // Validar que realmente sea una imagen
    $info = getimagesize($file_tmp_path);
    if ($info === false) {
        echo json_encode(["error" => true, "message" => "El archivo subido no es una imagen válida."]);
        exit;
    }

    // Ruta final
    $dest_path = $upload_dir . $imagen_nombre;


// Verificar tamaño del archivo
$size = filesize($file_tmp_path);
if ($size === false || $size === 0) {
    echo json_encode(["error" => true, "message" => "El archivo subido está vacío."]);
    exit;
}

// Verificar si realmente es una imagen
$info = getimagesize($file_tmp_path);
if ($info === false) {
    echo json_encode(["error" => true, "message" => "El archivo NO es una imagen válida."]);
    exit;
}


    // Mover archivo
    if (!move_uploaded_file($file_tmp_path, $dest_path)) {
        echo json_encode(["error" => true, "message" => "Error al guardar la imagen en el servidor."]);
        exit;
    }

    // Insertar en BD
    $sql = "INSERT INTO productos (marca, modelo, imagen, actividad, disponible, precio)
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["error" => true, "message" => "Error al preparar la consulta: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("sssidi", $marca, $modelo, $imagen_nombre, $actividad, $disponible, $precio);

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
?>
