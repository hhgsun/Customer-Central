import { API_URL, UPLOAD_STORAGE_URL } from "../config";
import StorageModel from "../models/StorageModel";

export default class StorageService {

  constructor() {
    this.API_URL = API_URL;
    this.UPLOAD_URL = UPLOAD_STORAGE_URL;
  }

  async getAllStorages(params = null) {
    var page = 1,
      sort_by = localStorage.getItem('sort_by_storage') !== 'undefined' && localStorage.getItem('sort_by_storage') !== null ? localStorage.getItem('sort_by_storage') : 'id',
      direction = localStorage.getItem('direction_storage') !== 'undefined' && localStorage.getItem('direction_storage') !== null ? localStorage.getItem('direction_storage') : 'DESC';
    if (params != null) {
      page = params.page ? params.page : 1;
      sort_by = params.sort_by ? params.sort_by : 'id';
      direction = params.direction ? params.direction : 'DESC';
    }
    const res = await fetch(`${this.API_URL}/storages?page=${page}&sort_by=${sort_by}&direction=${direction}`);
    const resdata = await res.json();
    const data = {
      ...resdata,
      storages: resdata.storages.map(f => Object.assign({}, new StorageModel(f)))
    };
    localStorage.setItem('direction_storage', data.direction);
    localStorage.setItem('sort_by_storage', data.sort_by);
    return data;
  }

  async addStorage(storage) {
    const res = await fetch(`${this.API_URL}/storages/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storage)
    });
    const added = await res.json();
    if (added) {
      this.fileUpload(storage.materials);
    }
    return added;
  }

  async updateStorage(storage) {
    const res = await fetch(`${this.API_URL}/storages/${storage.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storage)
    });
    const updated = await res.json();
    if (updated) {
      this.fileUpload(storage.materials)
    }
    return updated;
  }

  async fileUpload(materials) {
    const formData = new FormData();
    materials.forEach(material => {
      if (material.file_val && material.file_val.file) {
        if (material.file_val.file.size !== undefined) {
          formData.append('files[]', material.file_val.file, material.file_val.fileName);
        }
      }
    });
    if (formData.getAll("files[]").length < 1) {
      return true;
    }
    const res = await fetch(`${this.API_URL}/storages/image-upload`, {
      method: 'POST',
      body: formData,
    });
    const uploaded = await res.json();
    return uploaded;
  }


  async deleteStorage(storageId) {
    const res = await fetch(`${this.API_URL}/storages/${storageId}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const del = await res.json();
    return del;
  }

  async getStorageDetail(storageId) {
    const res = await fetch(`${this.API_URL}/storage/${storageId}`);
    let storage = await res.json();
    storage.layouts = JSON.parse(storage.layouts);
    storage.materials.map(material => {
      material.file_val = JSON.parse(material.file_val);
      material.color = JSON.parse(material.color);
      return material;
    });
    storage.materials.sort(function (a, b) { return a.order_number - b.order_number });

    // storage.materials[0].file_val.newAddedUrl değerlerini null yapar
    storage.materials.map(material => {
      if (material.file_val)
        material.file_val.newAddedUrl = null;
      return material;
    });

    return storage;
  }


}