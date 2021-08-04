<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\UploadedFileInterface;
use Slim\Factory\AppFactory;

// Tüm Formlar
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

    $sth = $db->prepare("SELECT * FROM forms WHERE isDelete = 0 ORDER BY ". $sort_by ." ". $direction ." LIMIT :limit OFFSET :offset");
    $sth->bindParam('limit', $limit, PDO::PARAM_INT);
    $sth->bindParam('offset', $offset, PDO::PARAM_INT);
    $sth->execute();
    $forms = $sth->fetchAll(PDO::FETCH_OBJ);

    $response->getBody()->write(json_encode(array(
      'total' => $total,
      'page' => $page,
      'forms' => $forms,
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


// Tekil Form
$app->get('/forms/{id}', function (Request $request, Response $response) {

  $id = $request->getAttribute('id');

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = $db->prepare("SELECT * FROM forms WHERE id = :id AND isDelete = 0");
    $sth->bindParam('id', $id, PDO::PARAM_INT);
    $sth->execute();
    $form = $sth->fetch(PDO::FETCH_OBJ);

    if( $form ) {
      $sth = $db->prepare("SELECT * FROM answers WHERE formId = :id AND isDelete = 0");
      $sth->bindParam('id', $id, PDO::PARAM_INT);
      $sth->execute();
      $form->sections = $sth->fetchAll(PDO::FETCH_OBJ);
    }
    
    $response->getBody()->write(json_encode($form));
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


// Form Ekle
$app->post('/forms/add', function (Request $request, Response $response) {

  $params = $request->getParsedBody();
  $params['createdDate'] = date("Y-m-d");
  $sections = $params['sections'];

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = 'INSERT INTO forms (title, status, createdDate, form_pass) VALUES (:title, :status, :createdDate, :form_pass)';
    $prepare = $db->prepare($sth);
    $isAddedForm = $prepare->execute([
                            'title' => $params['title'],
                            'status' => isset($params['status']) ? $params['status'] : 0,
                            'createdDate' => $params['createdDate'],
                            'form_pass' => $params['form_pass'],
                          ]);
    $formId = $db->lastInsertId();

    if( $isAddedForm && $formId ) {
      
      if( $sections ) {
        foreach ($sections as $key => $section) {
          addAnswersToForm($db, $section, $formId);
        }
      }

      $response->getBody()->write(json_encode($formId));
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


// MATHOD: Add Sections
function addAnswersToForm($db, $section, $formId){
  $section['value'] = json_encode($section['value']);
  $sth = 'INSERT INTO answers (formId, category, value, input_type, description, label, order_number, permission_edit)
          VALUES (:formId, :category, :value, :input_type, :description, :label, :order_number, :permission_edit)';
  $prepare = $db->prepare($sth);
  $prepare->execute([
              'formId' => $formId,
              'category' => $section['category'],
              'value' => $section['value'],
              'input_type' => $section['input_type'],
              'description' => $section['description'],
              'label' => $section['label'],
              'order_number' => $section['order_number'],
              'permission_edit' => $section['permission_edit'],
            ]);
}

// Form Güncelleme
$app->post('/forms/{formId}/update', function (Request $request, Response $response) {
  $formId = $request->getAttribute('formId');
  if(!$formId) {return;}

  $params = $request->getParsedBody();
  $params['updateDate'] = date("Y-m-d");
  $sections = $params['sections'];

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE forms 
            SET title=:title, status=:status, updateDate=:updateDate, form_pass=:form_pass
            WHERE id = :formId';
    $prepare = $db->prepare($sth);
    $isUpdateForm = $prepare->execute([
                            'title' => $params['title'],
                            'status' => isset($params['status']) ? $params['status'] : 0,
                            'updateDate' => $params['updateDate'],
                            'form_pass' => $params['form_pass'],
                            'formId' => $formId,
                          ]);

    if( $sections && $isUpdateForm ) {
      foreach ($sections as $key => $section) {
        // section update
        if( isset($section['id']) ) {
          $sth = 'UPDATE answers 
                  SET input_type = :input_type, category = :category, value = :value, description = :description, label = :label, order_number = :order_number, permission_edit = :permission_edit 
                  WHERE id = :id';
          $prepare = $db->prepare($sth);
          $prepare->execute([
                      'id' => $section['id'],
                      'category' => $section['category'],
                      'value' => json_encode($section['value']),
                      'input_type' => $section['input_type'],
                      'description' => $section['description'],
                      'label' => $section['label'],
                      'order_number' => $section['order_number'],
                      'permission_edit' => $section['permission_edit']
                    ]);
        } else {
          addAnswersToForm($db, $section, $formId); // add section
        }
      }
    }

    if( isset($params['deletedSectionIds']) && $params['deletedSectionIds'] != null ) {
      foreach ($params['deletedSectionIds'] as $sectionId) {
        $sth = 'UPDATE answers 
                SET isDelete=1
                WHERE id = :sectionId';
        $prepare = $db->prepare($sth);
        $isUpdateForm = $prepare->execute(['sectionId' => $sectionId]);
      }
    }

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


// Form Sil
$app->post('/forms/{id}/delete', function (Request $request, Response $response) {

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
$app->get('/forms/{formId}/answers', function (Request $request, Response $response) {

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
$app->post('/forms/image-upload', function (Request $request, Response $response) {
  $directory = __DIR__ . '/../../uploads/form';
  $uploadedFiles = $request->getUploadedFiles();

  try {
    $uploaded = array();
    // handle multiple inputs with the same key
    if( isset($uploadedFiles['images']) ) {
      foreach ($uploadedFiles['images'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
          $filename = moveUploadedFileForm($directory, $uploadedFile);
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
function moveUploadedFileForm(string $directory, UploadedFileInterface $uploadedFile) {
  $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
  $name = pathinfo($uploadedFile->getClientFilename(), PATHINFO_FILENAME);
  $filename = sprintf('%s.%0.8s', $name, $extension);
  $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
  return $filename;
}