import groq from 'groq';
import { client } from './client';

export interface Category {
  title: string;
  description: string;
  parents: Array<Category>;
}

export const getCategories = () =>
  client.fetch<Array<Category>>(groq`
*[_type=="category"]{
    title,
    description,
    parents
  }`);
