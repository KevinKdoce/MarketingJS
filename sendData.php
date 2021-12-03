<?php

require_once("./conexion.php");

$rut = $_POST['rut'];
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$charge = $_POST['charge'];
$idRbd = $_POST['id'];

$query = "INSERT INTO datasend (Rut, Nombre_Apellido, Correo, Telefono, Cargo, idRbd) VALUES ('$rut', '$name', '$email', '$phone', '$charge', '$idRbd')";
$conexion = connection::connect();
$response = mysqli_query($conexion, $query);
        
// $rows = mysqli_affected_rows($conexion, $query);

// return $rows; 
echo $response;
