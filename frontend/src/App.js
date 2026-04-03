import { useEffect, useState } from "react";

const BASE_URL = "https://ecommerce-vshg.onrender.com"; // your backend

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handlePayment = async () => {
    try {
      const res = await fetch(`${BASE_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const data = await res.json();

      const options = {
        key: "rzp_test_SZ04v6Id9Des9v", // same key
        amount: data.amount,
        currency: "INR",
        name: "My Store",
        description: "Demo Payment",
        order_id: data.id,

        handler: function () {
          alert("✅ Payment Successful (Demo)");
          setCart([]);
        },

        modal: {
          ondismiss: function () {
            alert("❌ Payment Cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <div>
      <h1>My Store</h1>

      <h2>Products</h2>
      {products.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <button onClick={() => addToCart(p)}>Add to Cart</button>
        </div>
      ))}

      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id}>
            {item.name} - ₹{item.price} x {item.qty}
          </div>
        ))
      )}

      <h3>Total: ₹{total}</h3>

      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default App;
