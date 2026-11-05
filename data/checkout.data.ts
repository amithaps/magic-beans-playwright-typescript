export const checkoutData = {
  contact: { firstName: "Alex", lastName: "Sefu", email: "alex@email.com" },
  shipping: {
    address: "Some street 1", city: "New York", zipCode: "12345", country: "United States",
  },
  payment: {
    nameOnCard: "Sefu", cardNumber: "1234 4567 1234 5678", expiry: "01/30", cvc: "123",
  },
};

export type ContactInfo = typeof checkoutData.contact;
export type ShippingAddress = typeof checkoutData.shipping;
export type PaymentInfo = typeof checkoutData.payment;
