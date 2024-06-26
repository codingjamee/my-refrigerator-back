import { Router } from "express";
import { ReceiptController } from "../controllers/Receipt.js";

export const receiptRouter = Router();

receiptRouter.get("/", ReceiptController.getReceipts);
receiptRouter.get("/:receipt_id", ReceiptController.getReceipt);
receiptRouter.post("/", ReceiptController.postReceipt);
receiptRouter.put("/:receipt_id", ReceiptController.putReceipt);
receiptRouter.delete("/:receipt_id", ReceiptController.deleteReceipt);
