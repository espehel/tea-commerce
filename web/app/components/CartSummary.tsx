import { useState, useEffect, FC, FormEvent } from 'react';
import { useShoppingCart } from 'use-shopping-cart';
import { useActionData, useSubmit } from '@remix-run/react';

const CartSummary: FC = () => {
  const submit = useSubmit();
  const data = useActionData();

  //setting up some React states for our cart
  const [loading, setLoading] = useState(false);
  const [cartEmpty, setCartEmpty] = useState(true);
  // destructuring all the building blocks we get from use-shopping-cart
  const { formattedTotalPrice, cartCount, clearCart, cartDetails, redirectToCheckout } =
    useShoppingCart();

  //sets our cartEmpty state with cart data
  useEffect(() => setCartEmpty(!cartCount), [cartCount]);

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit({ cartDetails: JSON.stringify(cartDetails) }, { method: 'post' });
    //if nothing went wrong, sends user to Stripe checkout
  };

  useEffect(() => {
    console.log(data);
    if (data) {
      redirectToCheckout({ sessionId: data.id });
    }
  }, [data]);

  return (
    <form onSubmit={handleCheckout}>
      <h2>Cart summary</h2>
      {/* This is where we'll render our cart;
			The item count changes quickly and may
			be mismatched between client and server.
			To avoid annoying error messages,
			we use 'supressHydrationWarning'.
			https://reactjs.org/docs/dom-elements.html#suppresshydrationwarning*/}
      <p suppressHydrationWarning>
        <strong>Number of Items:</strong> {cartCount}
      </p>
      <p suppressHydrationWarning>
        <strong>Total:</strong> {formattedTotalPrice}
      </p>

      <p>Use 4242 4242 4242 4242 as the card number.</p>
      <button className="cart-style-background" type="submit" disabled={cartEmpty || loading}>
        Checkout <div className="card-number"></div>
      </button>
      <button className="cart-style-background" type="button" onClick={clearCart}>
        Clear Cart
      </button>
    </form>
  );
};

export default CartSummary;
