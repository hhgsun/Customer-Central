// PUBLISH API SETTINGs
let API_URL = "http://thebluered.co.uk/clientcentral-api/index.php"
let UPLOAD_URL = "http://thebluered.co.uk/clientcentral-api"

if(process.env.NODE_ENV === "development") {
  API_URL = "http://localhost:5858";
  UPLOAD_URL = "http://localhost:5858"
}

let UPLOAD_FORM_URL = UPLOAD_URL + "/uploads/form/";
let UPLOAD_STORAGE_URL = UPLOAD_URL + "/uploads/storage/";
let UPLOAD_PRESENTATION_URL = UPLOAD_URL + "/uploads/presentation/";
let UPLOAD_AVATAR_URL = UPLOAD_URL + "/uploads/avatar/";
let DOWNLOAD_URL = API_URL + "/download-generatezip/storage/block-files/"; // .../{blockId}

// Local Storage Set Item Name
const JWT_LOCALSTORAGE_NAME = "jwt-token"

export {
  API_URL,
  UPLOAD_FORM_URL,
  UPLOAD_STORAGE_URL,
  UPLOAD_PRESENTATION_URL,
  UPLOAD_AVATAR_URL,
  DOWNLOAD_URL,
  JWT_LOCALSTORAGE_NAME,
}