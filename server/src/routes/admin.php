<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Form Ekle
$app->post('/admin', function (Request $request, Response $response) {
  $params = $request->getParsedBody();

  $adminUsername = 'admin';
  $adminPassword = 'tbr58582021';
  if( $params['username'] == $adminUsername && $params['password'] == $adminPassword ) {
    $response->getBody()->write(json_encode(true));
  } else {
    $response->getBody()->write(json_encode(false));
  }
  return $response->withHeader('Content-Type', 'application/json');
});

