<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\UploadedFileInterface;
use Slim\Factory\AppFactory;

// Tüm Presentations
$app->get('/presentations', function (Request $request, Response $response) {

  $page = isset($_GET['page']) ? $_GET['page'] : 1;
  $direction = isset($_GET['direction']) ? $_GET['direction'] : 'DESC';
  $sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'id';

  $limit = 50;
  $offset = ($page - 1) * $limit;

  $db = new Db();

  try {
    $db = $db->connect();

    $total = $db->query('SELECT COUNT(*) FROM presentations WHERE isDelete = 0')->fetchColumn();

    $sth = $db->prepare("SELECT * FROM presentations WHERE isDelete = 0 ORDER BY ". $sort_by ." ". $direction ." LIMIT :limit OFFSET :offset");
    $sth->bindParam('limit', $limit, PDO::PARAM_INT);
    $sth->bindParam('offset', $offset, PDO::PARAM_INT);
    $sth->execute();
    $presentations = $sth->fetchAll(PDO::FETCH_OBJ);

    $response->getBody()->write(json_encode(array(
      'total' => $total,
      'page' => $page,
      'presentations' => $presentations,
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


// Tekil Presentations
$app->get('/presentations/{id}', function (Request $request, Response $response) {

  $id = $request->getAttribute('id');

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = $db->prepare("SELECT * FROM presentations WHERE id = :id AND isDelete = 0");
    $sth->bindParam('id', $id, PDO::PARAM_INT);
    $sth->execute();
    $presentation = $sth->fetch(PDO::FETCH_OBJ);
    
    $response->getBody()->write(json_encode($presentation));
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


// Presentations Ekle
$app->post('/presentations/add', function (Request $request, Response $response) {

  $params = $request->getParsedBody();
  $params['createdDate'] = date("Y-m-d");

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = 'INSERT INTO presentations (title, images, createdDate) VALUES (:title, :images, :createdDate)';
    $prepare = $db->prepare($sth);
    $isAdded = $prepare->execute([
                            'title' => $params['title'],
                            'images' => json_encode($params['images']),
                            'createdDate' => $params['createdDate']
                          ]);
    $presentId = $db->lastInsertId();

    if( $isAdded && $presentId ) {
      $response->getBody()->write(json_encode($presentId));
    } else {
      $response->getBody()->write(json_encode(array(
        'message' => 'Presentation Eklenemedi'
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


// Presentations Güncelleme
$app->post('/presentations/{presentationId}/update', function (Request $request, Response $response) {
  $presentationsId = $request->getAttribute('presentationId');
  if(!$presentationsId) {return;}

  $params = $request->getParsedBody();
  $params['updateDate'] = date("Y-m-d");

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE presentations 
            SET title=:title, images=:images, updateDate=:updateDate
            WHERE id = :presentationId';
    $prepare = $db->prepare($sth);
    $isUpdate = $prepare->execute([
                            'title' => $params['title'],
                            'images' => json_encode($params['images']),
                            'updateDate' => $params['updateDate'],
                            'presentationId' => $presentationsId,
                          ]);

    $response->getBody()->write(json_encode($isUpdate));

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


// Presentation Sil
$app->post('/presentations/{id}/delete', function (Request $request, Response $response) {

  $id = $request->getAttribute('id');

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE presentations 
            SET isDelete=:isDelete
            WHERE id = :presentationId';
    $prepare = $db->prepare($sth);
    $isUpdate = $prepare->execute(['isDelete' => 1, 'presentationId' => $id]);
    $response->getBody()->write(json_encode($isUpdate));
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
$app->post('/presentations/image-upload', function (Request $request, Response $response) {
  $directory = __DIR__ . '/../../uploads/presentation';
  $uploadedFiles = $request->getUploadedFiles();

  try {
    $uploaded = array();
    // handle multiple inputs with the same key
    if( isset($uploadedFiles['images']) ) {
      foreach ($uploadedFiles['images'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
          $filename = moveUploadedFilePresentation($directory, $uploadedFile);
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
function moveUploadedFilePresentation(string $directory, UploadedFileInterface $uploadedFile) {
  $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
  $name = pathinfo($uploadedFile->getClientFilename(), PATHINFO_FILENAME);
  $filename = sprintf('%s.%0.8s', $name, $extension);
  $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
  return $filename;
}