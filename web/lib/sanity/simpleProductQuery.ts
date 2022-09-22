import groq from 'groq';
import { client } from './client';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  image: string;
  currency: string;
  categories: Array<string>;
}

export const getProducts = () =>
  client.fetch<Array<Product>>(groq`
*[_type=="simple-product"]{
    name,
    sku,
    description,
    price,
    "id": _id,
    "image": image.asset->url,
    currency,
    "categories": categories[]->title
  }`);

export const getProductBySKU = (sku: string | undefined) =>
  client.fetch<Product>(groq`
*[_type=="simple-product" && sku=="${sku}"][0]{
    name,
    sku,
    description,
    price,
    "id": _id,
    "image": image.asset->url,
    currency,
    "categories": categories[]->title
  }`);
