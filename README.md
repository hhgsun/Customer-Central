## CUSTOMER CENTRAL v2

https://anatoliaentertainment.com.tr/hhgsun/client-center-app

*admin:*
admin@clientcenter.com
demo1234

*user:*
demo@clientcenter.com
demo1234


## api için
src içine ``environment.php`` dosyası oluşturunuz.

```php
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
```