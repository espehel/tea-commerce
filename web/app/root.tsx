import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import styles from './styles/app.css';
import Header from './components/Header';
import { studioTheme, ThemeProvider } from '@sanity/ui';
import { CssVarsProvider } from '@mui/joy/styles';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { CartProvider } from './states/cart/CartProvider';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Tea Commerce',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export async function loader({ request, params }: LoaderArgs) {
  invariant(process.env.STRIPE_PUBLIC_KEY, 'Missing "process.env.STRIPE_PUBLIC_KEY"');
  return json({
    ENV: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  });
}

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <CssVarsProvider>
          <ThemeProvider theme={studioTheme}>
            <CartProvider>
              <Header />
              <main>
                <Outlet />
              </main>
            </CartProvider>
          </ThemeProvider>
        </CssVarsProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
