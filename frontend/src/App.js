import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Add to cart
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(
        cart.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Remove item
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Increase qty
  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  // Decrease qty
  const decreaseQty = (id) => {
    setCart(
      cart.map(item =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      ).filter(item => item.qty > 0)
    );
  };

  // Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 💳 Payment
  const handlePayment = async () => {
    const res = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: total }),
    });

    const data = await res.json();

    const options = {
      key: "rzp_test_SYyAVnudZLkLpN",
      amount: data.amount,
      currency: "INR",
      name: "My Store",
      description: "Test Payment",
      order_id: data.id,
      handler: function (response) {
        alert("Payment Successful!");
        console.log(response);
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

            <button onClick={() => increaseQty(item.id)}>+</button>
            <button onClick={() => decreaseQty(item.id)}>-</button>

            <button onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}

      <h3>Total: ₹{total}</h3>

      <button onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
}

export default App;