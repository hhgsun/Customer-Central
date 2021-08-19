export default class StorageModel {
  constructor(args) {
    args = args ?? {};
    this.id = args["id"] ?? null;
    this.title = args["title"] ?? '';
    this.description = args["description"] ?? '';
    this.layouts = args["layouts"] ?? [];
    this.createdDate = args["createdDate"] ?? '';
    this.updateDate = args["updateDate"] ?? '';
    this.materials = args["materials"] ?? [];
    this.deletedMaterialIds = [];
    this.userId = args["userId"] ?? 0;
  }
}
