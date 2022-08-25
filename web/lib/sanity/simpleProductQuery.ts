import groq from 'groq';

export interface Product {
  name: string;
  sku: string;
  description: string;
  price: number;
  image: string;
  currency: string;
  category: Array<any>;
}

export const getProducts = groq`
*[_type=="simple-product"]{
    name,
    sku,
    description,
    price,
    "id": _id,
    "image": image.asset->url,
    currency,
    category
  }`;
