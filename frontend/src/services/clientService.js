import ClientModel from "../models/ClientModel";

import { API_URL, UPLOAD_CLIENT_URL } from "./config";

export default class ClientService {

  constructor() {
    this.API_URL = API_URL;
    this.UPLOAD_URL = UPLOAD_CLIENT_URL;
  }

  async getAllClients(params = null) {
    var page = 1,
      sort_by = localStorage.getItem('sort_by_client') !== 'undefined' && localStorage.getItem('sort_by_client') !== null ? localStorage.getItem('sort_by_client') : 'id',
      direction = localStorage.getItem('direction_client') !== 'undefined' && localStorage.getItem('direction_client') !== null ? localStorage.getItem('direction_client') : 'DESC';
    if (params != null) {
      page = params.page ? params.page : 1;
      sort_by = params.sort_by ? params.sort_by : 'id';
      direction = params.direction ? params.direction : 'DESC';
    }
    const res = await fetch(`${this.API_URL}/clients?page=${page}&sort_by=${sort_by}&direction=${direction}`);
    const resdata = await res.json();
    const data = {
      ...resdata,
      clients: resdata.clients.map(f => Object.assign({}, new ClientModel(f)))
    };
    localStorage.setItem('direction_client', data.direction);
    localStorage.setItem('sort_by_client', data.sort_by);
    return data;
  }

  async addClient(client) {
    const res = await fetch(`${this.API_URL}/clients/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    const added = await res.json();
    if (added) {
      //this.imageUpload(client.materials);
    }
    return added;
  }

  async updateClient(client) {
    const res = await fetch(`${this.API_URL}/clients/${client.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    const updated = await res.json();
    if (updated) {
      //this.imageUpload(client.materials)
    }
    return updated;
  }

  async fileUpload(materials) {
    const formData = new FormData();
    materials.forEach(material => {
      if (material.value.length > 0) {
        material.value.forEach(fileObj => {
          if (fileObj && fileObj.file != null) {
            if (fileObj.file.size !== undefined) {
              formData.append('images[]', fileObj.file, fileObj.fileName);
            }
          }
        });
      }
    });
    const res = await fetch(`${this.API_URL}/clients/image-upload`, {
      method: 'POST',
      body: formData,
    });
    const uploaded = await res.json();
    return uploaded;
  }


  async deleteClient(clientId) {
    const res = await fetch(`${this.API_URL}/clients/${clientId}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const del = await res.json();
    return del;
  }

  async getClientMaterials(clientId) {
    const res = await fetch(`${this.API_URL}/clients/${clientId}/answers`);
    const materials = await res.json();
    materials.map(answer => answer.value = JSON.parse(answer.value)); // value JSON.parse("[\"val\", \"val\"]") from=>to ['val', 'val']
    materials.sort(function (a, b) { return a.order_number - b.order_number });
    return materials;
  }

  async getClientDetail(clientId) {
    const res = await fetch(`${this.API_URL}/clients/${clientId}`);
    let client = await res.json();
    client.layouts = JSON.parse(client.layouts);
    client.materials.map(material => {
      material.file_val = JSON.parse(material.file_val);
      material.color = JSON.parse(material.color);
      return material;
    });
    client.materials.sort(function (a, b) { return a.order_number - b.order_number });
    return client;
  }

}