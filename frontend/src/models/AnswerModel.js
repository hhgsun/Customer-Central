export default class AnswerModel {
  constructor(args) {
    args = args ?? {};
    this.id = args['id'] ?? null;
    this.input_type = args['input_type'] ?? 'text';
    this.label = args['label'] ?? '';
    this.category = args['category'] ?? '';
    this.value = args['value'] ?? [{ val: "" }];
    this.description = args['description'] ?? '';
    this.order_number = args['order_number'] ?? 0;
    this.permission_edit = args['permission_edit'] ?? "0";
  }
}