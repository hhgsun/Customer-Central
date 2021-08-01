export default class FormModel {
  constructor(args) {
    args = args ?? {};
    this.id = args["id"] ?? null;
    this.title = args["title"] ?? '';
    this.status = args["status"] ?? 0;
    this.createdDate = args["createdDate"] ?? '';
    this.updateDate = args["updateDate"] ?? '';
    this.sections = args["sections"] ?? [];
    this.form_pass = args["form_pass"] ?? "0000";
    this.deletedSectionIds = [];
  }
}
