import { ITemplatePayload } from "./interfaces";

export function generateOrderConfirmationTemplate(data: { orderId: string, total: string }): ITemplatePayload {
  const { orderId, total } = data;
  return {
    subject: `Order Confirmation - ${orderId}`,
    text: `Thank you for your order ${orderId}. Your total is ${total}.`,
    html: `<p>Thank you for your order <strong>${orderId}</strong>. Your total is <strong>${total}</strong>.</p>`,
  };
}
