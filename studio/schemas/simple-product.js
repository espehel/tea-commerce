export default {
  name: "simple-product",
  title: "Simple Product",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      title: "SKU",
      name: "sku",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "category" },
        },
      ],
    },
    {
      name: "price",
      title: "Price",
      description: "For now, add cents as zeroes, ie 500 = $5",
      type: "number",
    },
    {
      name: "currency",
      title: "Currency",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
  initialValue: {
    currency: "nok",
  },
};
