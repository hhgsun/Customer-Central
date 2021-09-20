<?php

class Db {

  public function __construct() {

    try {
      $this->dbhost = $_ENV['dbhost'];
      $this->dbuser = $_ENV['dbuser'];
      $this->dbpass = $_ENV['dbpass'];
      $this->dbname = $_ENV['dbname'];

      $db = $this->connect();

      //
      // CREATE DB TABLES

      $sth = "CREATE TABLE IF NOT EXISTS `forms` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `createdDate` date NOT NULL,
        `updateDate` date DEFAULT NULL,
        `title` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `description` text COLLATE utf8mb4_turkish_ci DEFAULT NULL,
        `isAnswered` tinyint(1) NOT NULL DEFAULT '0',
        `isDelete` tinyint(1) NOT NULL DEFAULT '0',
        `userId` int(11) NOT NULL,
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
      ";
      $prepare = $db->prepare($sth);
      $prepare->execute();

      $sth = "CREATE TABLE IF NOT EXISTS `form_answers` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `formId` int(11) NOT NULL,
        `category` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `value` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `input_type` varchar(255) COLLATE utf8mb4_turkish_ci NOT NULL DEFAULT 'text',
        `description` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `label` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `isDelete` int(11) NOT NULL DEFAULT '0',
        `order_number` int(11) NOT NULL DEFAULT '0',
        `permission_edit` tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=169 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
      ";
      $prepare = $db->prepare($sth);
      $prepare->execute();

      $sth = "CREATE TABLE IF NOT EXISTS `presentations` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `title` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `description` text COLLATE utf8mb4_turkish_ci DEFAULT NULL,
        `createdDate` date NOT NULL,
        `updateDate` date DEFAULT NULL,
        `isDelete` tinyint(1) NOT NULL DEFAULT '0',
        `images` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `userId` int(11) NOT NULL,
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
      ";
      $prepare = $db->prepare($sth);
      $prepare->execute();

      $sth = "CREATE TABLE IF NOT EXISTS `storages` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `createdDate` date NOT NULL,
        `updateDate` date DEFAULT NULL,
        `title` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `description` text COLLATE utf8mb4_turkish_ci DEFAULT NULL,
        `layouts` text COLLATE utf8mb4_turkish_ci,
        `isDelete` tinyint(1) NOT NULL DEFAULT '0',
        `userId` int(11) NOT NULL,
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
      ";
      $prepare = $db->prepare($sth);
      $prepare->execute();

      $sth = "CREATE TABLE IF NOT EXISTS `storage_materials` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `storageId` int(11) NOT NULL,
        `label` text COLLATE utf8mb4_turkish_ci NOT NULL,
        `file_val` text COLLATE utf8mb4_turkish_ci,
        `color` text COLLATE utf8mb4_turkish_ci,
        `type` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
        `layout_id` varchar(11) COLLATE utf8mb4_turkish_ci DEFAULT '0',
        `block_id` varchar(11) COLLATE utf8mb4_turkish_ci DEFAULT '0',
        `group_id` varchar(11) COLLATE utf8mb4_turkish_ci DEFAULT '0',
        `order_number` int(11) DEFAULT '0',
        `isDelete` tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
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
        `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
        `isDelete` tinyint(1) NOT NULL DEFAULT '0',
        `avatar` text COLLATE utf8mb4_turkish_ci DEFAULT NULL,
        `connections` text COLLATE utf8mb4_turkish_ci,
        PRIMARY KEY (`id`)
       ) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
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
    $mysql_connection = "mysql:host=$this->dbhost;dbname=$this->dbname;charset=utf8";
    $connection = new PDO($mysql_connection, $this->dbuser, $this->dbpass);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $connection;
  }

}
