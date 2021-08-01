export default class ClientModel {
  constructor(args) {
    args = args ?? {};
    this.id = args["id"] ?? null;
    this.title = args["title"] ?? '';
    this.layouts = args["layouts"] ?? [];
    this.createdDate = args["createdDate"] ?? '';
    this.updateDate = args["updateDate"] ?? '';
    this.materials = args["materials"] ?? [];
    this.deletedMaterialIds = [];
  }
}
