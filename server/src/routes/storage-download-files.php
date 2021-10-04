<?php


if(isset($_GET['block-id']) && isset($_GET['storage-download-files'])) {

  $blockId = $_GET['block-id'];

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

    $numFiles = fileZipAndDownload(
      __DIR__ . '/../../uploads/storage/',
      $file_names, 
      __DIR__ . '/../../uploads/storage-block/', 
      $blockId .'.zip',
    );

    print_r($numFiles);

  } catch (Exception $e) {
    print_r( array( 'message' => $e->getMessage(), 'code' => $e->getCode() ) );
  }
  exit;
}

// DOWNLOAD MATERIAL BLOCK FILES : ZIP

// HELPER: ZIP AND DOWNLOAD FILES
function fileZipAndDownload($filesDir, $fileNames, $zipDir, $zipName) {
  try {
    //$uploadedFilesDirectory = './uploads/storage/';
    //$zipName = './uploads/storage-block/'. $blockId .'.zip';

    $zipFilePath = $zipDir . $zipName;

    $zip = new ZipArchive;
    $res = $zip->open($zipFilePath, ZipArchive::CREATE);
    if($res !== TRUE) {
      die("Could not open archive (ZipArchive)");
    }
    foreach ($fileNames as $fname) {
      $filePath = $filesDir . $fname;
      if( file_exists($filePath) ) {
        $fileNewName = explode("__", $fname);
        if($fileNewName && count($fileNewName) > 0) {
          $fileNewName = $fileNewName[1];
        } else {
          $fileNewName = $fname;
        }
        $zip->addFile($filePath, $fileNewName);
      }
    }
    $numFiles = $zip->numFiles;
    $zip->close();

    header('Content-Type: application/zip');
    header('Content-disposition: attachment; filename='. $zipName);
    header('Content-Length: ' . filesize($zipFilePath));
    readfile($zipFilePath);

    return $numFiles;

  } catch (Exception $e) {
    array( array( 'message' => $e->getMessage(), 'code' => $e->getCode() ) );
  }

}