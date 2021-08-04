export default class MaterialModel {
  constructor(args) {
    args = args ?? {};
    this.id = args["id"] ?? null;
    this.clientId = args["clientId"] ?? null;
    this.label = args["label"] ?? '';
    this.file_val = args["file_val"] ?? {};
    this.color = args["color"] ?? { hex: "", cmyk: "", rgb: "" };
    this.type = args["type"] ?? '';
    this.layout_id = args["layout_id"] ?? null;
    this.block_id = args["block_id"] ?? null;
    this.group_id = args["group_id"] ?? null;
    this.order_number = args["order_number"] ?? 0;
  }
}