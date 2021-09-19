<?php
$isDev = TRUE; // yayınlanmadan önce burası yorum satırı hale getirilmelidir.

// #### PRODUCTION
$dbhost = '{db-host}';
$dbuser = '{db-user}';
$dbpass = '{db-password}';
$dbname = '{db-name}';

// #### DEVELOPMENT
if(isset($isDev) && $isDev) {
  $dbhost = '{dev-db-host}';
  $dbuser = '{dev-db-user}';
  $dbpass = '{dev-db-password}';
  $dbname = '{dev-db-name}';
}