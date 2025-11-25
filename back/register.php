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

    $nombre = $conn->real_escape_string($data->nombre);
    $email = $conn->real_escape_string($data->email);
    $password = $conn->real_escape_string($data->password);

    // Check if email already exists
    $check_sql = "SELECT id_usuario FROM usuarios WHERE email = '$email'";
    $check_result = $conn->query($check_sql);

    if ($check_result->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["message" => "El correo electrónico ya está registrado."]);
    } else {
        $sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES ('$nombre', '$email', '$password', 'usuario')";

        if ($conn->query($sql) === TRUE) {
            http_response_code(201); // Created
            echo json_encode(["message" => "Usuario registrado con éxito."]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["message" => "Error al registrar el usuario: " . $conn->error]);
        }
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Método no permitido."]);
}
?>
