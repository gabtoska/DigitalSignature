<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true);

if (
    empty($data['to']) ||
    empty($data['subject']) ||
    empty($data['pdfBase64']) ||
    empty($data['firstName']) ||
    empty($data['lastName'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters.']);
    exit;
}

$to = $data['to'];
$subject = $data['subject'];
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$message = $data['message'];
$pdfBase64 = $data['pdfBase64'];

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'nenshkrimielektronikk@gmail.com';
    $mail->Password = 'oahk cqwt zkud eumy';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('nenshkrimielektronikk@gmail.com', 'Nenshkrimi Elektronik');
    $mail->addAddress($to, "$firstName $lastName");

    $mail->Subject = $subject;
    $mail->Body = "Përshëndetje $firstName $lastName,\n\n$message";

    $pdfData = base64_decode($pdfBase64);
    $mail->addStringAttachment($pdfData, "$firstName _$lastName.pdf", 'base64', 'application/pdf');

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Mailer Error: ' . $mail->ErrorInfo]);
}
