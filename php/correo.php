<?php
   $destinatario = 'gabrielsuarez24@gmail.com';

   $nombre = $_POST['nombre'];
   $asunto = $_POST['asunto'];
   $telefono = $_POST['telefono'];
   $mensaje = $_POST['mensaje'];
   $email = $_POST['email'];

   $header = "Enviado desde la pagina de SAKRON";
   $mensajeCompleto = $mensaje . "\nAtentamente: " . $nombre;

   mail($destinatario, $asunto, $mensajeCompleto, $telefono, $header);
   echo " <script>alert('Correo enviado exitosamente')</script>";
   echo " <script> setTimeout(\"location.href='index.html'\",1000)</script>";


?>