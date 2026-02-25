<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Pega os dados do formulário
    $nome = strip_tags(trim($_POST["nome"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $assunto_msg = strip_tags(trim($_POST["assunto"]));
    $mensagem = strip_tags(trim($_POST["mensagem"]));

    // 2. Configurações do E-mail
    $destino = "contato@amendolaeamendola.com.br"; // SEU E-MAIL AQUI
    $titulo = "Novo Contato: " . ($assunto_msg ? $assunto_msg : "Sem Assunto");

    // 3. Monta o corpo do e-mail
    $corpo = "Nome: $nome\n";
    $corpo .= "Email: $email\n\n";
    $corpo .= "Mensagem:\n$mensagem";

    // 4. Cabeçalhos (Headers) - Importante para não cair no SPAM
    $headers = "From: contato@amendolaeamendola.com.br" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // 5. Envia o e-mail
    if (mail($destino, $titulo, $corpo, $headers)) {
        // Redireciona para uma página de sucesso ou volta para o site
        echo "<script>alert('Mensagem enviada com sucesso!'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Erro ao enviar. Tente novamente.'); window.history.back();</script>";
    }
} else {
    header("Location: index.html");
}
?>