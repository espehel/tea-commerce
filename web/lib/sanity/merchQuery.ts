import groq from 'groq';

export const merchQuery = groq`
*[_type=="merch"]{
    name,
    sku,
    description,
    price,
    "id": _id,
    "image": image.asset->url,
    currency
  }`;
