export default {
  name: "order",
  title: "Order",
  type: "document",
  readOnly: true,
  preview: {
    select: {
      title: "_createdAt",
      subtitle: "paymentStatus",
    },
  },
  fields: [
    {
      name: "paymentStatus",
      title: "Payment status",
      type: "string",
    },
    {
      name: "emailStatus",
      title: "Email status",
      type: "string",
    },
    {
      name: "orderlines",
      title: "Orderlines",
      type: "array",
      of: [
        {
          type: "orderline",
        },
      ],
    },
  ],
};
