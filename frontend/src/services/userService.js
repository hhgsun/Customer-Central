import { API_URL, UPLOAD_STORAGE_URL } from "../config";
import UserModel from "../models/UserModel";

export default class UserService {

  constructor() {
    this.API_URL = API_URL;
    this.UPLOAD_URL = UPLOAD_STORAGE_URL;
  }

  async getAllUsers() {
    const res = await fetch(`${this.API_URL}/users-notlimit`);
    const resdata = await res.json();
    const data = {
      ...resdata,
      users: resdata.users.map(f => Object.assign({}, new UserModel(f)))
    };
    return data;
  }

  async updateUser(user) {
    const res = await fetch(`${this.API_URL}/users/${user.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const updated = await res.json();
    return updated;
  }

  async deleteUser(userId) {
    const res = await fetch(`${this.API_URL}/users/${userId}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const del = await res.json();
    return del;
  }

  async getUserDetail(userId) {
    const res = await fetch(`${this.API_URL}/users/${userId}`);
    let user = await res.json();
    user.connections = JSON.parse(user.connections);
    console.log(user);
    return user;
  }

}