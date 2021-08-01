import FormModel from "../models/FormModel";

import { API_URL, UPLOAD_FORM_URL } from "./config";

export default class FormService {

  constructor() {
    this.API_URL = API_URL;
    this.UPLOAD_URL = UPLOAD_FORM_URL;
  }

  async getAllForms(params = null) {
    var page = 1,
      sort_by = localStorage.getItem('sort_by_form') !== 'undefined' && localStorage.getItem('sort_by_form') !== null ? localStorage.getItem('sort_by_form') : 'id',
      direction = localStorage.getItem('direction_form') !== 'undefined' && localStorage.getItem('direction_form') !== null ? localStorage.getItem('direction_form') : 'DESC';
    if (params != null) {
      page = params.page ? params.page : 1;
      sort_by = params.sort_by ? params.sort_by : 'id';
      direction = params.direction ? params.direction : 'DESC';
    }
    const res = await fetch(`${this.API_URL}/forms?page=${page}&sort_by=${sort_by}&direction=${direction}`);
    const resdata = await res.json();
    const data = {
      ...resdata,
      forms: resdata.forms.map(f => Object.assign({}, new FormModel(f)))
    };
    localStorage.setItem('sort_by_form', data.sort_by);
    localStorage.setItem('direction_form', data.direction);
    return data;
  }

  async addForm(form) {
    const res = await fetch(`${this.API_URL}/forms/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const added = await res.json();
    if( added ) {
      this.imageUpload(form.sections)
    }
    return added;
  }

  async updateForm(form) {
    const res = await fetch(`${this.API_URL}/forms/${form.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const updated = await res.json();
    if( updated ) {
      this.imageUpload(form.sections)
    }
    return updated;
  }

  async imageUpload(sections) {
    const formData = new FormData();
    sections.forEach(section => {
      if (section.value.length > 0) {
        section.value.forEach(fileObj => {
          if (fileObj && fileObj.file != null) {
            if (fileObj.file.size !== undefined) {
              formData.append('images[]', fileObj.file, fileObj.fileName);
            }
          }
        });
      }
    });
    const res = await fetch(`${this.API_URL}/forms/image-upload`, {
      method: 'POST',
      body: formData,
    });
    const uploaded = await res.json();
    return uploaded;
  }


  async deleteForm(formId) {
    const res = await fetch(`${this.API_URL}/forms/${formId}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const del = await res.json();
    return del;
  }

  async getFormAnswers(formId) {
    const res = await fetch(`${this.API_URL}/forms/${formId}/answers`);
    const answers = await res.json();
    answers.map(answer => answer.value = JSON.parse(answer.value)); // value JSON.parse("[\"val\", \"val\"]") from=>to ['val', 'val']
    answers.sort(function (a, b) { return a.order_number - b.order_number });
    return answers;
  }

  async getFormDetail(formId) {
    const res = await fetch(`${this.API_URL}/forms/${formId}`);
    const form = await res.json();
    form.sections.map(section => section.value = JSON.parse(section.value));
    form.sections.sort(function (a, b) { return a.order_number - b.order_number });
    form.deletedSectionIds = [];
    return form;
  }

}