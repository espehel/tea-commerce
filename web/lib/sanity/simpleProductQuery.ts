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

export const getProductsByCategory = (category: string) =>
  client.fetch<Array<Product>>(groq`
*[_type=="simple-product" && "${category}" in categories[]->title]{
    name,
    sku,
    description,
    price,
    "id": _id,
    "image": image.asset->url,
    currency,
    "categories": categories[]->title
  }`);

export const getProductsByMatch = (term: string) =>
  client.fetch<Array<Product>>(groq`
*[_type == "simple-product"] 
  | score(name match "${term}" || description match "${term}") 
  [ _score > 0 ]
  | order(_score desc) 
  {
    name,
    sku,
    description,
    price,
    "id": _id,
    "image": image.asset->url,
    currency,
    "categories": categories[]->title,
    _score
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
