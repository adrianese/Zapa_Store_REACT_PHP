<?php // login.php
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

    $email = $conn->real_escape_string($data->email);
    $password = $conn->real_escape_string($data->password);

    $sql = "SELECT * FROM usuarios WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if ($password === $user['password']) {
            // Do not send the password hash to the client
            unset($user['password']);
            echo json_encode($user);
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(["message" => "Contraseña incorrecta."]);
        }
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["message" => "Usuario no encontrado."]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Método no permitido."]);
}
?>
