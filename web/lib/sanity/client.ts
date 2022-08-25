import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'develop',
  //   token: 'sanity-auth-token', // or leave commented out to be anonymous user
  useCdn: true, // `false` if you want to ensure fresh data
});
