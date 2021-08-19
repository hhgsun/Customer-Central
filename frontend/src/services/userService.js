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
    const data = {
      ...user,
      avatar: user.avatar ? {
        ...user.avatar,
        newAddedUrl: null
      } : null
    };
    const res = await fetch(`${this.API_URL}/users/${user.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const updated = await res.json();
    if (updated) {
      this.fileUpload(user.avatar);
    }
    return updated;
  }

  async fileUpload(avatar) {
    if (!avatar || avatar === null || avatar === undefined) {
      return 0;
    }
    if (avatar.file !== undefined && avatar.file !== null && avatar.file !== [] && avatar.newAddedUrl !== null) {
      const formData = new FormData();
      formData.append('images[]', avatar.file, avatar.fileName);
      const res = await fetch(`${this.API_URL}/users/image-upload`, {
        method: 'POST',
        body: formData,
      });
      const uploaded = await res.json();
      return uploaded;
    }
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
    user.avatar = JSON.parse(user.avatar);
    console.log(user);
    return user;
  }

}