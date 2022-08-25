import { client } from './client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder(client);

export default function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
