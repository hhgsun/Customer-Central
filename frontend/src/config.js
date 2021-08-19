
let isDeveloping = false;

// PUBLISH API SETTINGs
let API_URL = "https://gazianteposbteknokent.click/customer-api-service/index.php";
let uploadBasePath = "https://gazianteposbteknokent.click/customer-api-service"
let UPLOAD_FORM_URL = uploadBasePath + "/uploads/form/";
let UPLOAD_STORAGE_URL = uploadBasePath + "/uploads/storage/";
let UPLOAD_PRESENTATION_URL = uploadBasePath + "/uploads/presentation/";
let UPLOAD_AVATAR_URL = uploadBasePath + "/uploads/avatar/";

// DEVELOPER
if (isDeveloping) {
  API_URL = "http://localhost:5858";
  UPLOAD_FORM_URL = "http://localhost:5858/uploads/form/";
  UPLOAD_STORAGE_URL = "http://localhost:5858/uploads/storage/";
  UPLOAD_PRESENTATION_URL = "http://localhost:5858/uploads/presentation/";
  UPLOAD_AVATAR_URL = "http://localhost:5858/uploads/avatar/";
}

// Local Storage Set Item Name
const JWT_LOCALSTORAGE_NAME = "jwt-token"

export {
  API_URL,
  UPLOAD_FORM_URL,
  UPLOAD_STORAGE_URL,
  UPLOAD_PRESENTATION_URL,
  UPLOAD_AVATAR_URL,
  JWT_LOCALSTORAGE_NAME,
}