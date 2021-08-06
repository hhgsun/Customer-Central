
let isDeveloping = false;

// PUBLISH API SETTINGs
let API_URL = "https://gazianteposbteknokent.click/customer-api-service/index.php";
let uploadBasePath = "https://gazianteposbteknokent.click/customer-api-service"
let UPLOAD_FORM_URL = uploadBasePath + "/uploads/form/";
let UPLOAD_CLIENT_URL = uploadBasePath + "/uploads/client/";
let UPLOAD_PRESENTATION_URL = uploadBasePath + "/uploads/presentation/";

// DEVELOPER
if (isDeveloping) {
  API_URL = "http://localhost:5858";
  UPLOAD_FORM_URL = "http://localhost:5858/uploads/form/";
  UPLOAD_CLIENT_URL = "http://localhost:5858/uploads/client/";
  UPLOAD_PRESENTATION_URL = "http://localhost:5858/uploads/presentation/"
}

export { API_URL, UPLOAD_FORM_URL, UPLOAD_CLIENT_URL, UPLOAD_PRESENTATION_URL }
