<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\UploadedFileInterface;
use Slim\Factory\AppFactory;
use Slim\Http\Stream;

// Tüm Storages
$app->get('/storages', function (Request $request, Response $response) {

  $page = isset($_GET['page']) ? $_GET['page'] : 1;
  $direction = isset($_GET['direction']) ? $_GET['direction'] : 'DESC';
  $sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'id';

  $limit = 50;
  $offset = ($page - 1) * $limit;

  $db = new Db();

  try {
    $db = $db->connect();

    $total = $db->query('SELECT COUNT(*) FROM storages WHERE isDelete = 0')->fetchColumn();

    $sth = $db->prepare("SELECT * FROM storages WHERE isDelete = 0 ORDER BY ". $sort_by ." ". $direction ." LIMIT :limit OFFSET :offset");
    $sth->bindParam('limit', $limit, PDO::PARAM_INT);
    $sth->bindParam('offset', $offset, PDO::PARAM_INT);
    $sth->execute();
    $storages = $sth->fetchAll(PDO::FETCH_OBJ);

    $response->getBody()->write(json_encode(array(
      'total' => $total,
      'page' => $page,
      'storages' => $storages,
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


// Tekil storage
$app->get('/storage/{id}', function (Request $request, Response $response) {

  $id = $request->getAttribute('id');

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = $db->prepare("SELECT * FROM storages WHERE id = :id AND isDelete = 0");
    $sth->bindParam('id', $id, PDO::PARAM_INT);
    $sth->execute();
    $storage = $sth->fetch(PDO::FETCH_OBJ);

    if( $storage ) {
      $sth = $db->prepare("SELECT * FROM storage_materials WHERE storageId = :id AND isDelete = 0");
      $sth->bindParam('id', $id, PDO::PARAM_INT);
      $sth->execute();
      $storage->materials = $sth->fetchAll(PDO::FETCH_OBJ);
    }
    
    $response->getBody()->write(json_encode($storage));
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


// Storage Ekle
$app->post('/storages/add', function (Request $request, Response $response) {

  $params = $request->getParsedBody();
  $params['createdDate'] = date("Y-m-d");
  $materials = $params['materials'];

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = 'INSERT INTO storages (title, description, layouts, createdDate, userId) VALUES (:title, :description, :layouts, :createdDate, :userId)';
    $prepare = $db->prepare($sth);
    $isAdded = $prepare->execute([
                            'title' => $params['title'],
                            'description' => $params['description'],
                            'layouts' => json_encode($params['layouts']),
                            'createdDate' => $params['createdDate'],
                            'userId' => $params['userId'] ? $params['userId'] : 0,
                          ]);
    $storageId = $db->lastInsertId();

    if( $isAdded && $storageId ) {
      
      // add materials
      foreach ($materials as $key => $material) {
        addMaterialsToStorage($db, $material, $storageId);
      }

      $response->getBody()->write(json_encode($storageId));
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

// MATHOD: Add Materials
function addMaterialsToStorage($db, $material, $storageId){
  $material['file_val'] = json_encode($material['file_val']);
  $material['color'] = json_encode($material['color']);
  $sth = 'INSERT INTO storage_materials (storageId, label, file_val, type, layout_id, block_id, group_id, color, order_number)
              VALUES (:storageId, :label, :file_val, :type, :layout_id, :block_id, :group_id, :color, :order_number)';
  $prepare = $db->prepare($sth);
  $prepare->execute([
              'storageId' => $storageId,
              'label' => isset($material['label']) ? $material['label'] : "",
              'file_val' => $material['file_val'],
              'type' => $material['type'],
              'layout_id' => $material['layout_id'],
              'block_id' => $material['block_id'],
              'group_id' => $material['group_id'],
              'color' => $material['color'],
              'order_number' => $material['order_number'],
            ]);
}


// Storage Güncelleme
$app->post('/storages/{storageId}/update', function (Request $request, Response $response) {
  $storageId = $request->getAttribute('storageId');
  if(!$storageId) { return; };

  $params = $request->getParsedBody();
  $params['updateDate'] = date("Y-m-d");
  $materials = $params['materials'];

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE storages 
            SET title=:title, description=:description, layouts=:layouts, updateDate=:updateDate, userId=:userId 
            WHERE id = :storageId';
    $prepare = $db->prepare($sth);
    $isUpdateStorage = $prepare->execute([
                            'title' => $params['title'],
                            'description' => $params['description'],
                            'layouts' => json_encode($params['layouts']),
                            'updateDate' => $params['updateDate'],
                            'storageId' => $storageId,
                            'userId' => $params['userId'] ? $params['userId'] : 0,
                          ]);

    if( $materials && $isUpdateStorage ) {
      foreach ($materials as $key => $material) {
        // update material
        if( isset($material['id']) ) {
          $sth = 'UPDATE storage_materials 
                  SET label = :label, file_val = :file_val, type = :type, layout_id = :layout_id, block_id = :block_id, 
                  group_id = :group_id, color = :color, order_number = :order_number 
                  WHERE id = :id';
          $prepare = $db->prepare($sth);
          $prepare->execute([
                      'id' => $material['id'],
                      'label' => $material['label'],
                      'file_val' => json_encode($material['file_val']),
                      'type' => $material['type'],
                      'layout_id' => $material['layout_id'],
                      'block_id' => $material['block_id'],
                      'group_id' => $material['group_id'],
                      'color' => json_encode($material['color']),
                      'order_number' => $material['order_number'],
                    ]);
        } else {
          addMaterialsToStorage($db, $material, $storageId); // add material
        }
      }
    }

    if( isset($params['deletedMaterialIds']) && $params['deletedMaterialIds'] != null ) {
      foreach ($params['deletedMaterialIds'] as $matId) {
        $sth = 'UPDATE storage_materials 
                SET isDelete=1
                WHERE id = :matId';
        $prepare = $db->prepare($sth);
        $isUpdateStorage = $prepare->execute(['matId' => $matId]);
      }
    }

    $response->getBody()->write(json_encode($isUpdateStorage));

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


// Storage Sil
$app->post('/storages/{id}/delete', function (Request $request, Response $response) {

  $id = $request->getAttribute('id');

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE storages 
            SET isDelete=:isDelete
            WHERE id = :storageId';
    $prepare = $db->prepare($sth);
    $isUpdateForm = $prepare->execute(['isDelete' => 1, 'storageId' => $id]);
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
$app->post('/storages/image-upload', function (Request $request, Response $response) {
  $directory = __DIR__ . '/../../uploads/storage';
  $uploadedFiles = $request->getUploadedFiles();

  try {
    $uploaded = array();
    // handle multiple inputs with the same key
    if( isset($uploadedFiles['files']) ) {
      foreach ($uploadedFiles['files'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
          $filename = moveUploadedFileStorage($directory, $uploadedFile);
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
function moveUploadedFileStorage(string $directory, UploadedFileInterface $uploadedFile) {
  $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
  $name = pathinfo($uploadedFile->getClientFilename(), PATHINFO_FILENAME);
  $filename = sprintf('%s.%0.8s', $name, $extension);
  $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
  return $filename;
}


// DOWNLOAD MATERIAL BLOCK FILES : ZIP
$app->get('/download/storage/block-files/{id}', function (Request $request, Response $response) {
  $blockId = $request->getAttribute('id');
  $db = new Db();
  try {
    $db = $db->connect();
    $sth = $db->prepare("SELECT * FROM storage_materials WHERE isDelete = 0 AND block_id = :block_id");
    $sth->bindParam('block_id', $blockId, PDO::PARAM_STR);
    $sth->execute();
    $materials = $sth->fetchAll(PDO::FETCH_OBJ);

    $file_names = array();
    foreach ($materials as $material) {
      if( isset($material->file_val) ) {
        $fileVal = json_decode($material->file_val);
        if( isset($fileVal) && isset($fileVal->fileName) ) {
          $file_names[] = $fileVal->fileName;
        }
      }
    }

    $uploadedFilesDirectory = './uploads/storage/';
    $zipname = './uploads/storage-block/'. $blockId .'.zip';

    $zip = new ZipArchive;
    $res = $zip->open($zipname, ZipArchive::CREATE);
    if($res !== TRUE) {
      die("Could not open archive (ZipArchive)");
    }
    foreach ($file_names as $file) {
      $filePath = $uploadedFilesDirectory . $file;
      if( file_exists($filePath) ) {
        $fileNewName = explode("__", $file)[1];
        if(!isset($fileNewName)) {
          $fileNewName = $file;
        }
        $zip->addFile($filePath, $fileNewName);
      }
    }
    $numFiles = $zip->numFiles;
    $zip->close();

    return $response
              ->withHeader('Content-Type', 'application/octet-stream')
              ->withHeader('Content-Disposition', 'attachment; filename='.$blockId .'_FILES.zip')
              ->withAddedHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
              ->withHeader('Cache-Control', 'post-check=0, pre-check=0')
              ->withHeader('Pragma', 'no-cache')
              ->withBody((new \Slim\Psr7\Stream(fopen($zipname, 'rb'))));
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