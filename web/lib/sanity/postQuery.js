import groq from "groq";

export const postQuery = groq`
  *[_type == "post"&& slug.current == $slug][0]{
    _id,
    title,
    publishedAt,
    "slug": slug.current,
    "categories":   category[]->{title, slug},
    mainImage,
    body,
  }
`;
