<?php

require_once("./conexion.php");

$rut = $_POST['rut'];
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$charge = $_POST['charge'];
$Rbd = $_POST['rbd'];
$college = $_POST['nameCollege'];
$comuna = $_POST['nameComuna'];

$query = "INSERT INTO dataSend (Rut, Nombre_Apellido, Correo, Telefono, Cargo, RBD, Colegio, Comuna) VALUES ('$rut', '$name', '$email', '$phone', '$charge', '$Rbd',
'$college', '$comuna')";
$conexion = connection::connect();
$response = mysqli_query($conexion, $query);

// $rows = mysqli_affected_rows($conexion, $query);

// return $rows; 
echo $response;
