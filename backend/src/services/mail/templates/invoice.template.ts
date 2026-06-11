import { ITemplatePayload } from "./interfaces";

export function generateInvoiceTemplate(data: { invoiceId: string, amount: string, dueDate: string }): ITemplatePayload {
  const { invoiceId, amount, dueDate } = data;
  return {
    subject: `Invoice ${invoiceId} from MotoXCode`,
    text: `Please find your invoice ${invoiceId} for ${amount} due by ${dueDate}.`,
    html: `<p>Please find your invoice <strong>${invoiceId}</strong> for <strong>${amount}</strong> due by <strong>${dueDate}</strong>.</p>`,
  };
}
