<?php

class Db
{
  // Database info
  private $dbhost = 'localhost';
  private $dbuser = 'u8683260_tbr';
  private $dbpass = 'KVth07U9ARil34O';
  private $dbname = 'u8683260_tbr';

  // init create table
  public function __construct() {
    $db = $this->connect();
    try {
      $sth = "CREATE TABLE IF NOT EXISTS `forms` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `createdDate` date NOT NULL,
        `updateDate` date DEFAULT NULL,
        `title` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `status` tinyint(1) NOT NULL DEFAULT '0',
        `isDelete` tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
       ";
      $prepare = $db->prepare($sth);
      $prepare->execute();

      $sth = "CREATE TABLE IF NOT EXISTS `answers` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `formId` int(11) NOT NULL,
        `category` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `value` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `input_type` varchar(255) COLLATE utf8mb4_turkish_ci NOT NULL DEFAULT 'text',
        `description` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `required` tinyint(1) NOT NULL DEFAULT '0',
        `label` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `isDelete` int(11) NOT NULL DEFAULT '0',
        `order_number` int(11) NOT NULL DEFAULT '0',
        `permission_edit` tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
       ";
      $prepare = $db->prepare($sth);
      $prepare->execute();

      $sth = "CREATE TABLE IF NOT EXISTS `users` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `email` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `firstname` varchar(255) COLLATE utf8mb4_turkish_ci NOT NULL,
        `lastname` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
        `password` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `createdDate` date NOT NULL,
        `lastLoginDate` date DEFAULT NULL,
        `status` int(11) NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
       ";
      $prepare = $db->prepare($sth);
      $prepare->execute();

    } catch (PDOException $e) {
      print_r(json_encode(array(
        'message' => $e->getMessage(),
        'code' => $e->getCode(),
      )));
    }
  }

  // connect db
  public function connect() {
    // develepment database
    if( $_ENV['SLIM_MODE'] == 'development' ) {
      $this->dbhost = 'localhost';
      $this->dbuser = 'root';
      $this->dbpass = '';
      $this->dbname = 'brief_central';
    }
    $mysql_connection = "mysql:host=$this->dbhost;dbname=$this->dbname;charset=utf8";
    $connection = new PDO($mysql_connection, $this->dbuser, $this->dbpass);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $connection;
  }

}
