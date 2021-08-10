export default class FormModel {
  constructor(args) {
    args = args ?? {};
    this.id = args["id"] ?? null;
    this.title = args["title"] ?? '';
    this.isAnswered = args["isAnswered"] ?? 0;
    this.createdDate = args["createdDate"] ?? '';
    this.updateDate = args["updateDate"] ?? '';
    this.answers = args["answers"] ?? [];
    this.form_pass = args["form_pass"] ?? "0000";
    this.deletedAnswerIds = [];
    this.userId = args["userId"] ?? 0;
  }
}
