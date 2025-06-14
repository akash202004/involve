import crypto from "crypto";

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  razorpaySignature: string,
  secret: string
): boolean => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${orderId}|${paymentId}`);
  const expectedSignature = hmac.digest("hex");
  return expectedSignature === razorpaySignature;
};
