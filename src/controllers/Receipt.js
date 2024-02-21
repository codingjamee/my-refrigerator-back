import { ReceiptModel } from "../models/ReceiptModel";

export class ReceiptController {
  static async getReceipt({ receiptId }) {
    return ReceiptModel.find({ where: { receiptId } });
  }
}
