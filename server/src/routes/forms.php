<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\UploadedFileInterface;
use Slim\Factory\AppFactory;

// Tüm Formlar
$app->get('/forms', function (Request $request, Response $response) {

  $page = isset($_GET['page']) ? $_GET['page'] : 1;
  $direction = isset($_GET['direction']) ? $_GET['direction'] : 'DESC';
  $sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'id';

  $limit = 50;
  $offset = ($page - 1) * $limit;

  $db = new Db();

  try {
    $db = $db->connect();

    $total = $db->query('SELECT COUNT(*) FROM forms WHERE isDelete = 0')->fetchColumn();

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
      $sth = $db->prepare("SELECT * FROM form_answers WHERE formId = :id AND isDelete = 0");
      $sth->bindParam('id', $id, PDO::PARAM_INT);
      $sth->execute();
      $form->answers = $sth->fetchAll(PDO::FETCH_OBJ);
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
  $answers = $params['answers'];

  $db = new Db();

  try {
    $db = $db->connect();

    $sth = 'INSERT INTO forms (title, description, isAnswered, createdDate, userId) VALUES (:title, :description, :isAnswered, :createdDate, :userId)';
    $prepare = $db->prepare($sth);
    $isAddedForm = $prepare->execute([
                            'title' => $params['title'],
                            'description' => $params['description'],
                            'isAnswered' => isset($params['isAnswered']) ? $params['isAnswered'] : 0,
                            'createdDate' => $params['createdDate'],
                            'userId' => $params['userId'] ? $params['userId'] : 0,
                          ]);
    $formId = $db->lastInsertId();

    if( $isAddedForm && $formId ) {
      
      if( $answers ) {
        foreach ($answers as $key => $answer) {
          addAnswersToForm($db, $answer, $formId);
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


// MATHOD: Add Answer
function addAnswersToForm($db, $answer, $formId){
  $answer['value'] = json_encode($answer['value']);
  $sth = 'INSERT INTO form_answers (formId, category, value, input_type, description, label, order_number, permission_edit)
          VALUES (:formId, :category, :value, :input_type, :description, :label, :order_number, :permission_edit)';
  $prepare = $db->prepare($sth);
  $prepare->execute([
              'formId' => $formId,
              'category' => $answer['category'],
              'value' => $answer['value'],
              'input_type' => $answer['input_type'],
              'description' => $answer['description'],
              'label' => $answer['label'],
              'order_number' => $answer['order_number'],
              'permission_edit' => $answer['permission_edit'],
            ]);
}

// Form Güncelleme
$app->post('/forms/{formId}/update', function (Request $request, Response $response) {
  $formId = $request->getAttribute('formId');
  if(!$formId) {return;}

  $params = $request->getParsedBody();
  $params['updateDate'] = date("Y-m-d");
  $answers = $params['answers'];

  $db = new Db();

  try {
    $db = $db->connect();
    $sth = 'UPDATE forms 
            SET title=:title, description=:description, isAnswered=:isAnswered, updateDate=:updateDate, userId=:userId
            WHERE id = :formId';
    $prepare = $db->prepare($sth);
    $isUpdateForm = $prepare->execute([
                            'title' => $params['title'],
                            'description' => $params['description'],
                            'isAnswered' => isset($params['isAnswered']) ? $params['isAnswered'] : 0,
                            'updateDate' => $params['updateDate'],
                            'userId' => $params['userId'] ? $params['userId'] : 0,
                            'formId' => $formId,
                          ]);

    if( $answers && $isUpdateForm ) {
      foreach ($answers as $key => $answer) {
        // answer update
        if( isset($answer['id']) ) {
          $sth = 'UPDATE form_answers 
                  SET input_type = :input_type, category = :category, value = :value, description = :description, label = :label, order_number = :order_number, permission_edit = :permission_edit 
                  WHERE id = :id';
          $prepare = $db->prepare($sth);
          $prepare->execute([
                      'id' => $answer['id'],
                      'category' => $answer['category'],
                      'value' => json_encode($answer['value']),
                      'input_type' => $answer['input_type'],
                      'description' => $answer['description'],
                      'label' => $answer['label'],
                      'order_number' => $answer['order_number'],
                      'permission_edit' => $answer['permission_edit']
                    ]);
        } else {
          addAnswersToForm($db, $answer, $formId); // add answer
        }
      }
    }

    if( isset($params['deletedAnswerIds']) && $params['deletedAnswerIds'] != null ) {
      foreach ($params['deletedAnswerIds'] as $answerId) {
        $sth = 'UPDATE form_answers 
                SET isDelete=1
                WHERE id = :answerId';
        $prepare = $db->prepare($sth);
        $isUpdateForm = $prepare->execute(['answerId' => $answerId]);
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
    
    $sth = $db->prepare('SELECT * FROM form_answers WHERE formId = :formId AND isDelete = 0');
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
    if( isset($uploadedFiles['files']) ) {
      foreach ($uploadedFiles['files'] as $uploadedFile) {
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