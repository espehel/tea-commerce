export default {
  name: "orderline",
  title: "Orderline",
  type: "object",
  fields: [
    {
      name: "productName",
      title: "Product name",
      type: "string",
    },
    {
      name: "productRef",
      title: "Product reference",
      type: "reference",
      to: [{ type: "simple-product" }],
    },
  ],
};
