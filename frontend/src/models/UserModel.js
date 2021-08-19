export default class UserModel {
  constructor(args) {
    args = args ?? {};
    this.id = args["id"] ?? null;
    this.email = args["email"] ?? null;
    this.firstname = args["firstname"] ?? null;
    this.lastname = args["lastname"] ?? null;
    this.createdDate = args["createdDate"] ?? '';
    this.lastLoginDate = args["lastLoginDate"] ?? '';
    this.avatar = args["avatar"] ?? null;
    this.isAdmin = args["isAdmin"] ?? 0;

    this.connections = args["connections"] ?? {};
    this.forms = args["forms"] ?? [];
    this.storages = args["storages"] ?? [];
    this.presentations = args["presentations"] ?? [];
  }
}
