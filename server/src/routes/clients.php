<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\UploadedFileInterface;
use Slim\Factory\AppFactory;

// Tüm Clientler
$app->get('/clients', function (Request $request, Response $response) {

  $page = isset($_GET['page']) ? $_GET['page'] : 1;
  $direction = isset($_GET['direction']) ? $_GET['direction'] : 'DESC';
  $sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'id';

  $limit = 50;
  $offset = ($page - 1) * $limit;

  $db = new Db();

  try {
    $db = $db->connect();

    $total = $db->query('SELECT COUNT(*) FROM clients WHERE isDelete = 0')->fetchColumn();

    $sth = $db->prepare("SELECT * FROM clients WHERE isDelete = 0 ORDER BY ". $sort_by ." ". $direction ." LIMIT :limit OFFSET :offset");
    $sth->bindParam('limit', $limit, PDO::PARAM_INT);
    $sth->bindParam('offset', $offset, PDO::PARAM_INT);
    $sth->execute();
    $clients = $sth->fetchAll(PDO::FETCH_OBJ);

    $response->getBody()->write(json_encode(array(
      'total' => $total,
      'page' => $page,
      'clients' => $clients,
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


// Tekil Client
$app->get('/clients/{id}', function (Request $request, Response $response) {

  $id = $request->getAttribute('id');

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = $db->prepare("SELECT * FROM clients WHERE id = :id AND isDelete = 0");
    $sth->bindParam('id', $id, PDO::PARAM_INT);
    $sth->execute();
    $client = $sth->fetch(PDO::FETCH_OBJ);

    if( $client ) {
      $sth = $db->prepare("SELECT * FROM materials WHERE clientId = :id AND isDelete = 0");
      $sth->bindParam('id', $id, PDO::PARAM_INT);
      $sth->execute();
      $client->materials = $sth->fetchAll(PDO::FETCH_OBJ);
    }
    
    $response->getBody()->write(json_encode($client));
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


// Client Ekle
$app->post('/clients/add', function (Request $request, Response $response) {

  $params = $request->getParsedBody();
  $params['createdDate'] = date("Y-m-d");
  $materials = $params['materials'];

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = 'INSERT INTO clients (title, layouts, createdDate) VALUES (:title, :layouts, :createdDate)';
    $prepare = $db->prepare($sth);
    $isAdded = $prepare->execute([
                            'title' => $params['title'],
                            'layouts' => json_encode($params['layouts']),
                            'createdDate' => $params['createdDate']
                          ]);
    $clientId = $db->lastInsertId();

    if( $isAdded && $clientId ) {
      
      if( $materials ) {
        foreach ($materials as $key => $material) {
          $sth = 'INSERT INTO materials (clientId, label, file_val, type, layout_id, block_id, group_id, color, order_number)
                  VALUES (:clientId, :label, :file_val, :type, :layout_id, :block_id, :group_id, :color, :order_number)';
          $prepare = $db->prepare($sth);
          $prepare->execute([
                      'clientId' => $clientId,
                      'label' => $material['label'],
                      'file_val' => json_encode($material['file_val']),
                      'type' => $material['type'],
                      'layout_id' => $material['layout_id'],
                      'block_id' => $material['block_id'],
                      'group_id' => $material['group_id'],
                      'color' => json_encode($material['color']),
                      'order_number' => $material['order_number'],
                    ]);
        }
      }

      $response->getBody()->write(json_encode($clientId));
    } else {
      $response->getBody()->write(json_encode(array(
        'message' => 'Form Eklenemedi'
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


// Client Güncelleme
$app->post('/clients/{clientId}/update', function (Request $request, Response $response) {
  $clientId = $request->getAttribute('clientId');
  if(!$clientId) { return; };

  $params = $request->getParsedBody();
  $params['updateDate'] = date("Y-m-d");
  $materials = $params['materials'];

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE clients 
            SET title=:title, layouts=:layouts, updateDate=:updateDate 
            WHERE id = :clientId';
    $prepare = $db->prepare($sth);
    $isUpdateClient = $prepare->execute([
                            'title' => $params['title'],
                            'layouts' => json_encode($params['layouts']),
                            'updateDate' => $params['updateDate'],
                            'clientId' => $clientId
                          ]);

    if( $materials && $isUpdateClient ) {
      foreach ($materials as $key => $material) {
        $material['file_val'] = json_encode($material['file_val']);
        $material['color'] = json_encode($material['color']);
        // update material
        if( isset($material['id']) ) {
          $sth = 'UPDATE materials 
                  SET label = :label, file_val = :file_val, type = :type, layout_id = :layout_id, block_id = :block_id, 
                  group_id = :group_id, color = :color, order_number = :order_number 
                  WHERE id = :id';
          $prepare = $db->prepare($sth);
          $prepare->execute([
            'id' => $material['id'],
            'label' => $material['label'],
            'file_val' => $material['file_val'],
            'type' => $material['type'],
            'layout_id' => $material['layout_id'],
            'block_id' => $material['block_id'],
            'group_id' => $material['group_id'],
            'color' => $material['color'],
            'order_number' => $material['order_number'],
          ]);
        }
        // add material
        else {
          $sth = 'INSERT INTO materials (clientId, label, file_val, type, layout_id, block_id, group_id, color, order_number)
                  VALUES (:clientId, :label, :file_val, :type, :layout_id, :block_id, :group_id, :color, :order_number)';
            $prepare = $db->prepare($sth);
            $prepare->execute([
              'clientId' => $clientId,
              'label' => $material['label'],
              'file_val' => $material['file_val'],
              'type' => $material['type'],
              'layout_id' => $material['layout_id'],
              'block_id' => $material['block_id'],
              'group_id' => $material['group_id'],
              'color' => $material['color'],
              'order_number' => $material['order_number'],
            ]);
        }
      }
    }

    if( isset($params['deletedMaterialIds']) && $params['deletedMaterialIds'] != null ) {
      foreach ($params['deletedMaterialIds'] as $matId) {
        $sth = 'UPDATE materials 
                SET isDelete=1
                WHERE id = :matId';
        $prepare = $db->prepare($sth);
        $isUpdateClient = $prepare->execute(['matId' => $matId]);
      }
    }

    $response->getBody()->write(json_encode($isUpdateClient));

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


// Form Sil
$app->post('/clients/{id}/delete', function (Request $request, Response $response) {

  $id = $request->getAttribute('id');

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE forms 
            SET isDelete=:isDelete
            WHERE id = :formId';
    $prepare = $db->prepare($sth);
    $isUpdateForm = $prepare->execute(['isDelete' => 1, 'formId' => $id]);
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


// Forma ait tüm cevaplar
$app->get('/clients/{formId}/answers', function (Request $request, Response $response) {

  $formId = $request->getAttribute('formId');

  $db = new Db();

  try {
    $db = $db->connect();
    
    $sth = $db->prepare('SELECT * FROM answers WHERE formId = :formId AND isDelete = 0');
    $sth->bindParam('formId', $formId, PDO::PARAM_INT);
    $sth->execute();
    $answers = $sth->fetchAll(PDO::FETCH_OBJ);

    $response->getBody()->write(json_encode($answers));
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
$app->post('/clients/image-upload', function (Request $request, Response $response) {
  $directory = __DIR__ . '/../../uploads';
  $uploadedFiles = $request->getUploadedFiles();

  try {
    $uploaded = array();
    // handle multiple inputs with the same key
    if( isset($uploadedFiles['images']) ) {
      foreach ($uploadedFiles['images'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
          $filename = moveUploadedFile2($directory, $uploadedFile);
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

function moveUploadedFile2(string $directory, UploadedFileInterface $uploadedFile) {
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $name = pathinfo($uploadedFile->getClientFilename(), PATHINFO_FILENAME);
    $filename = sprintf('%s.%0.8s', $name, $extension);
    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
    return $filename;
}
