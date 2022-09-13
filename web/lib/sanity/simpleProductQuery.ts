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
  category: Array<any>;
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
    category
  }`);

export const getProductBySKU = (sku: string | undefined) =>
  client.fetch<Array<Product>>(groq`
*[_type=="simple-product" && sku=="${sku}"]{
    name,
    sku,
    description,
    price,
    "id": _id,
    "image": image.asset->url,
    currency,
    category
  }`);
