export default class PresentationModel {
  constructor(args) {
    args = args ?? {};
    this.id = args["id"] ?? null;
    this.title = args["title"] ?? '';
    this.createdDate = args["createdDate"] ?? '';
    this.updateDate = args["updateDate"] ?? '';
    this.images = args["images"] ?? [];
    this.userId = args["userId"] ?? 0;
  }
}
