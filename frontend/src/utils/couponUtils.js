export const validateCoupon = (couponCode, coupons, total) => {
  const found = coupons.find(
    (c) => c.code.toLowerCase() === couponCode.toLowerCase()
  );

  if (!found) {
    return { success: false, message: "Invalid Coupon ❌" };
  }

  if (total < found.min) {
    return {
      success: false,
      message: `Minimum order ₹${found.min} required ❌`,
    };
  }

  let discount = 0;

  if (found.type === "percent") {
    discount = (total * found.discount) / 100;
  } else {
    discount = found.discount;
  }

  return {
    success: true,
    discount,
    coupon: found,
  };
};