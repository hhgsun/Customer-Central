<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\UploadedFileInterface;
use Slim\Factory\AppFactory;

// Tüm Kullanıcılar
$app->get('/users', function (Request $request, Response $response) {
  $page = isset($_GET['page']) ? $_GET['page'] : 1;
  $direction = isset($_GET['direction']) ? $_GET['direction'] : 'DESC';
  $sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'id';

  $limit = 50;
  $offset = ($page - 1) * $limit;

  $db = new Db();

  try {
    $db = $db->connect();

    $total = $db->query('SELECT COUNT(*) FROM users WHERE isDelete = 0')->fetchColumn();

    $sth = $db->prepare("SELECT * FROM users WHERE isDelete = 0 ORDER BY ". $sort_by ." ". $direction ." LIMIT :limit OFFSET :offset");
    $sth->bindParam('limit', $limit, PDO::PARAM_INT);
    $sth->bindParam('offset', $offset, PDO::PARAM_INT);
    $sth->execute();
    $users = $sth->fetchAll(PDO::FETCH_OBJ);

    $response->getBody()->write(json_encode(array(
      'total' => $total,
      'page' => $page,
      'users' => $users,
      'limit' => $limit,
      'direction' => $direction,
      'sort_by' => $sort_by,
    )));
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


// Tüm Kullanıcılar Limitsiz
$app->get('/users-notlimit', function (Request $request, Response $response) {
  $db = new Db();
  try {
    $db = $db->connect();
    $sth = $db->prepare("SELECT * FROM users WHERE isDelete = 0");
    $sth->execute();
    $users = $sth->fetchAll(PDO::FETCH_OBJ);
    $count = count($users);
    $response->getBody()->write(json_encode(array(
      'total' => $count,
      'page' => 1,
      'users' => $users,
      'limit' => $count,
      'direction' => "DESC",
      'sort_by' => "id",
    )));
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


// Tekil User
$app->get('/users/{id}', function (Request $request, Response $response) {

  $id = $request->getAttribute('id');

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = $db->prepare("SELECT * FROM users WHERE id = :id AND isDelete = 0");
    $sth->bindParam('id', $id, PDO::PARAM_INT);
    $sth->execute();
    $user = $sth->fetch(PDO::FETCH_OBJ);

    $sth = $db->prepare("SELECT * FROM forms WHERE userId = :userId AND isDelete = 0");
    $sth->bindParam('userId', $id, PDO::PARAM_INT);
    $sth->execute();
    $user->forms = $sth->fetchAll(PDO::FETCH_OBJ);

    $sth = $db->prepare("SELECT * FROM storages WHERE userId = :userId AND isDelete = 0");
    $sth->bindParam('userId', $id, PDO::PARAM_INT);
    $sth->execute();
    $user->storages = $sth->fetchAll(PDO::FETCH_OBJ);

    $sth = $db->prepare("SELECT * FROM presentations WHERE userId = :userId AND isDelete = 0");
    $sth->bindParam('userId', $id, PDO::PARAM_INT);
    $sth->execute();
    $user->presentations = $sth->fetchAll(PDO::FETCH_OBJ);
    
    $response->getBody()->write(json_encode($user));
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

// User Güncelleme
$app->post('/users/{userId}/update', function (Request $request, Response $response) {
  $userId = $request->getAttribute('userId');
  if(!$userId) {return;}

  $params = $request->getParsedBody();
  $params['updateDate'] = date("Y-m-d");

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE users 
            SET firstname=:firstname, lastname=:lastname, isAdmin=:isAdmin, avatar=:avatar
            WHERE id = :userId';
    $prepare = $db->prepare($sth);
    $isUpdateForm = $prepare->execute([
                            'firstname' => $params['firstname'],
                            'lastname' => $params['lastname'],
                            'isAdmin' => $params['isAdmin'] ? $params['isAdmin'] : 0,
                            'avatar' => json_encode($params['avatar']),
                            'userId' => $userId
                          ]);

    $response->getBody()->write(json_encode($isUpdateForm));

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


// User Sil
$app->post('/users/{id}/delete', function (Request $request, Response $response) {
  $id = $request->getAttribute('id');
  $db = new Db();
  try {
    $db = $db->connect();
    $sth = 'UPDATE users 
            SET isDelete=:isDelete
            WHERE id = :userId';
    $prepare = $db->prepare($sth);
    $isUpdateForm = $prepare->execute(['isDelete' => 1, 'userId' => $id]);
    $response->getBody()->write(json_encode($isUpdateForm));
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


/**
 * 
 */

// IMAGE UPLOAD
$app->post('/users/image-upload', function (Request $request, Response $response) {
  $directory = __DIR__ . '/../../uploads/avatar';
  $uploadedFiles = $request->getUploadedFiles();

  try {
    $uploaded = array();
    // handle multiple inputs with the same key
    if( isset($uploadedFiles['images']) ) {
      foreach ($uploadedFiles['images'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
          $filename = moveUploadedFileUser($directory, $uploadedFile);
          $uploaded[] = $filename;
        }
      }
    }

    $response->getBody()->write(json_encode($uploaded));
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

// HELPER: FILE UPLOAD
function moveUploadedFileUser(string $directory, UploadedFileInterface $uploadedFile) {
  $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
  $name = pathinfo($uploadedFile->getClientFilename(), PATHINFO_FILENAME);
  $filename = sprintf('%s.%0.8s', $name, $extension);
  $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
  return $filename;
}