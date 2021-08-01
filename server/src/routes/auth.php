<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\UploadedFileInterface;
use Slim\Factory\AppFactory;
use \Firebase\JWT\JWT;

// JWT::$leeway = X; // oturum zamanını kontrol amaçlı gerekli

// https://www.techiediaries.com/php-jwt-authentication-tutorial/

// Auth Check
$app->post('/auth-check', function (Request $request, Response $response) {
  $params = $request->getParsedBody();
  /* $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
  $arr = explode(" ", $authHeader);
  $jwt = $arr[1]; */
  $jwt = $params['token'];
  try {
    $decoded = JWT::decode($jwt, "hhgsun", array('HS256'));
    $response->getBody()->write(json_encode(array(
      'success' => true,
      "jwt" => $decoded
    )));
    return $response
              ->withHeader('Content-Type', 'application/json');
  } catch (Exception $e) {
    $payload = json_encode(array(
      'message' => $e->getMessage(),
      'code' => $e->getCode(),
    ));
    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json')
              ->withStatus(500);
  }
});

// Login
$app->post('/login', function (Request $request, Response $response) {
  $params = $request->getParsedBody();
  $email = isset($params['email']) ? $params['email'] :"";
  $password = isset($params['password']) ? $params['password'] :"";
  $db = new Db();
  try {
    $db = $db->connect();

    $user = getUserByEmail($db, $email);

    if( $user ) {
      
      if( password_verify($password, $user->password) ) {
        $secret_key = "hhgsun";
        $issuer_claim = "customer_central"; // this can be the servername
        $audience_claim = "THE_AUDIENCE";
        $issuedat_claim = time(); // issued at
        $notbefore_claim = $issuedat_claim + 10; //not before in seconds
        $expire_claim = $issuedat_claim * 60 * 1000; // expire time in seconds

        $token = array(
          "iss" => $issuer_claim,
          "aud" => $audience_claim,
          "iat" => $issuedat_claim,
          "nbf" => $notbefore_claim,
          "exp" => $expire_claim,
          "data" => array(
              "id" => $user->id,
              "firstname" => $user->firstname,
              "lastname" => $user->lastname,
              "email" => $email
        ));

        $jwt = JWT::encode($token, $secret_key);

        $response->getBody()->write(json_encode(array(
          'success' => true,
          "jwt" => $jwt
        )));

      } else {
        $response->getBody()->write(json_encode(array(
          'success' => false,
          'message' => "Hatalı şifre"
        )));
      }
      
    } else {
      $response->getBody()->write(json_encode(array(
        'message' => 'Bu mail adresi kayıtlı değil.'
      )));
    }
    return $response
              ->withHeader('Content-Type', 'application/json');

  } catch (PDOException $e) {
    $payload = json_encode(array(
      'message' => $e->getMessage(),
      'code' => $e->getCode(),
    ));
    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json')
              ->withStatus(500);
  }

});

// Register
$app->post('/register', function (Request $request, Response $response) {

  $params = $request->getParsedBody();
  $params['createdDate'] = date("Y-m-d");

  $db = new Db();

  try {
    $db = $db->connect();

    $user = getUserByEmail($db, $params['email']);
    if( $user ) {
      $response->getBody()->write(json_encode(array(
        'message' => 'Bu mail adresi kullanılmaktadır.'
      )));
    } else {
      $sth = 'INSERT INTO users (email, password, createdDate, firstname, lastname) VALUES (:email, :password, :createdDate, :firstname, :lastname)';
      $prepare = $db->prepare($sth);
      $isAddedUser = $prepare->execute([
                              'email' => $params['email'],
                              'password' => password_hash($params['password'], PASSWORD_DEFAULT),
                              'createdDate' => $params['createdDate'],
                              'firstname' => $params['firstname'],
                              'lastname' => $params['lastname']
                            ]);
      $isAddedUser = $db->lastInsertId();
  
      if( $isAddedUser ) {
        $response->getBody()->write(json_encode($isAddedUser));
      } else {
        $response->getBody()->write(json_encode(array(
          'message' => 'Kullanıcı Oluşturulamdı'
        )));
      }
    }
    return $response
              ->withHeader('Content-Type', 'application/json');
  } catch (PDOException $e) {
    $payload = json_encode(array(
      'message' => $e->getMessage(),
      'code' => $e->getCode(),
    ));
    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json')
              ->withStatus(500);
  }

});

// Reset Pass
$app->post('/reset-pass', function (Request $request, Response $response) {
  $params = $request->getParsedBody();
  $email = isset($params['email']) ? $params['email'] :"";
  $password = isset($params['password']) ? $params['password'] :"";
  $newPassword = isset($params['newPassword']) ? $params['newPassword'] : null;

  $db = new Db();

  try {
    $db = $db->connect();

    $user = getUserByEmail($db, $email);

    if( $user && $newPassword ) {

      if( password_verify($password, $user->password) ) {
        $sth = 'UPDATE users SET password=:password WHERE id = :userid';
        $prepare = $db->prepare($sth);
        $isUpdateUser = $prepare->execute([ 'userid' => $user->id, 'password' => password_hash($newPassword, PASSWORD_DEFAULT) ]);

        if($isUpdateUser) {
          $response->getBody()->write(json_encode(array(
            'success' => true
          )));  
        } else {
          $response->getBody()->write(json_encode(array(
            'message' => 'Şifre değiştirilemedi, beklenmedik hata.'
          ))); 
        }
      } else {
        $response->getBody()->write(json_encode(array(
          'message' => 'Şifre yanlış.'
        )));
      }
      
    } else {
      if( $newPassword == null ) {
        $response->getBody()->write(json_encode(array(
          'message' => 'Yeni şifre belirtiniz.'
        )));        
      } else {
        $response->getBody()->write(json_encode(array(
          'message' => 'Bu mail adresi kayıtlı değil.'
        )));
      }
    }
    return $response
              ->withHeader('Content-Type', 'application/json');

  } catch (PDOException $e) {
    $payload = json_encode(array(
      'message' => $e->getMessage(),
      'code' => $e->getCode(),
    ));
    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json')
              ->withStatus(500);
  }

});

// UTILS
function getUserByEmail($db, $email) {
  $sth = $db->prepare('SELECT * FROM users WHERE email = :email');
  $sth->bindParam('email', $email);
  $sth->execute();
  return $sth->fetch(PDO::FETCH_OBJ);
}