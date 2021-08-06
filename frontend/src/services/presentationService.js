import PresentationModel from "../models/PresentationModel";

import { API_URL, UPLOAD_PRESENTATION_URL } from "../config";

export default class PresentationService {

  constructor() {
    this.API_URL = API_URL;
    this.UPLOAD_URL = UPLOAD_PRESENTATION_URL;
  }

  async getAllPresentations(params = null) {
    var page = 1,
      sort_by = localStorage.getItem('sort_by_present') !== 'undefined' && localStorage.getItem('sort_by_present') !== null ? localStorage.getItem('sort_by_present') : 'id',
      direction = localStorage.getItem('direction_present') !== 'undefined' && localStorage.getItem('direction_present') !== null ? localStorage.getItem('direction_present') : 'DESC';
    if (params != null) {
      page = params.page ? params.page : 1;
      sort_by = params.sort_by ? params.sort_by : 'id';
      direction = params.direction ? params.direction : 'DESC';
    }
    const res = await fetch(`${this.API_URL}/presentations?page=${page}&sort_by=${sort_by}&direction=${direction}`);
    const resdata = await res.json();
    const data = {
      ...resdata,
      presentations: resdata.presentations.map(p => Object.assign({}, new PresentationModel(p)))
    };
    localStorage.setItem('direction_present', data.direction);
    localStorage.setItem('sort_by_present', data.sort_by);
    return data;
  }

  async addPresentation(present) {
    present.images.map(p => {
      p.newAddedUrl = null; return p;
    });
    const res = await fetch(`${this.API_URL}/presentations/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(present)
    });
    const added = await res.json();
    if (added) {
      this.fileUpload(present.images);
    }
    return added;
  }

  async updatePresentation(present) {
    console.log(present);
    present.images.map(p => {
      p.newAddedUrl = null; return p;
    });
    const res = await fetch(`${this.API_URL}/presentations/${present.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(present)
    });
    const updated = await res.json();
    if (updated) {
      this.fileUpload(present.images)
    }
    return updated;
  }

  async fileUpload(images) {
    const formData = new FormData();
    images.forEach(image => {
      if (image && image.file) {
        if (image.file.size !== undefined) {
          formData.append('images[]', image.file, image.fileName);
        }
      }
    });
    const res = await fetch(`${this.API_URL}/presentations/image-upload`, {
      method: 'POST',
      body: formData,
    });
    const uploaded = await res.json();
    console.log(uploaded);
    return uploaded;
  }


  async deletePresentation(presentId) {
    const res = await fetch(`${this.API_URL}/presentations/${presentId}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const del = await res.json();
    return del;
  }

  async getPresentationDetail(presentId) {
    const res = await fetch(`${this.API_URL}/presentations/${presentId}`);
    let present = await res.json();
    present.images = JSON.parse(present.images);
    return present;
  }

}