import groq from 'groq';

export interface Category {
  title: string;
  description: string;
  parents: Array<Category>;
}

export const getCategories = groq`
*[_type=="category"]{
    title,
    description,
    parents
  }`;
