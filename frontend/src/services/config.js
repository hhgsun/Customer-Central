let isDeveloping = true;

// PUBLISH API SETTINGs
let API_URL = "http://thebluered.co.uk/brief-api";
let UPLOAD_FORM_URL = "http://thebluered.co.uk/brief-api/uploads/form/";
let UPLOAD_CLIENT_URL = "http://thebluered.co.uk/brief-api/uploads/client/";

// DEVELOPER
if( isDeveloping ) {
  API_URL = "http://localhost:5858";
  UPLOAD_FORM_URL = "http://localhost:5858/uploads/form/";
  UPLOAD_CLIENT_URL = "http://localhost:5858/uploads/client/";
}

export { API_URL, UPLOAD_FORM_URL, UPLOAD_CLIENT_URL }
