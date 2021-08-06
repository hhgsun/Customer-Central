
import { API_URL } from "../config";

export default class AuthService {

  constructor() {
    this.API_URL = API_URL;
  }

  async login(payload) {
    const res = await fetch(`${this.API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async register(payload) {
    const res = await fetch(`${this.API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }


}