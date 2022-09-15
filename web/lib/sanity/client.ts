import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'develop',
  token: process.env.SANITY_WRITE_KEY,
  apiVersion: '2022-09-15',
  useCdn: true, // `false` if you want to ensure fresh data
});
