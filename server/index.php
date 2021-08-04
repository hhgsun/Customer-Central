<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

// $_ENV['SLIM_MODE'] = 'development';
$_ENV['SLIM_MODE'] = 'production';


require __DIR__ . '/vendor/autoload.php';
require './src/config/db.php';

$app = AppFactory::create();

// dynamic path for sub folder
$app->setBasePath((function () {
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
    $uri = (string) parse_url('http://a' . $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (stripos($uri, $_SERVER['SCRIPT_NAME']) === 0) {
        return $_SERVER['SCRIPT_NAME'];
    }
    if ($scriptDir !== '/' && stripos($uri, $scriptDir) === 0) {
        return $scriptDir;
    }
    return '';
})());

  
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(false, false, false);
  
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});


$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Customer Central");
    return $response;
});

// ROUTES
require './src/routes/auth.php';
require './src/routes/forms.php';
require './src/routes/clients.php';
require './src/routes/presentations.php';
require './src/routes/admin.php';

$app->run();
