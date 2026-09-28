const book = {
  id: 1,
  title: "Bobo's First Little Learning Adventure",
  price: 450
};

let cart = JSON.parse(localStorage.getItem("boboCart") || "[]");

function save() {
  localStorage.setItem("boboCart", JSON.stringify(cart));
  updateCount();
}

function updateCount() {
  const count = document.getElementById("cartCount");
  if (count) {
    count.textContent = cart.reduce((n, i) => n + i.qty, 0);
  }
}

function addToCart(id) {
  let item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...book, qty: 1 });
  }

  save();
  alert("Book added to your cart!");
}

function openCart() {
  renderCart();
  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
}

function renderCart() {
  const box = document.getElementById("cartItems");

  if (!cart.length) {
    box.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cartTotal").textContent = "LKR 0";
    return;
  }

  box.innerHTML = cart.map(i => `
    <div class="item">
      <span>
        ${i.title}<br>
        <small>LKR ${i.price.toLocaleString()} × ${i.qty}</small>
      </span>
      <button onclick="removeItem(${i.id})">Remove</button>
    </div>
  `).join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById("cartTotal").textContent =
    "LKR " + total.toLocaleString();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  save();
  renderCart();
}

function checkout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  document.getElementById("orderModal").classList.remove("hidden");
}

function closeOrder() {
  document.getElementById("orderModal").classList.add("hidden");
}

function orderText(name, phone, address, payment) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const items = cart
    .map(i => `${i.title} x ${i.qty} - LKR ${(i.price * i.qty).toLocaleString()}`)
    .join("\n");

  return `📚 New Book Order%0A%0A${encodeURIComponent(items)}%0A%0A👤 Name: ${encodeURIComponent(name)}%0A📞 Phone: ${encodeURIComponent(phone)}%0A📍 Address: ${encodeURIComponent(address)}%0A💳 Payment: ${encodeURIComponent(payment)}%0A💰 Total: LKR ${total.toLocaleString()}`;
}

function submitOrder(e) {
  e.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const payment = document.getElementById("paymentMethod").value;

  const orders = JSON.parse(
    localStorage.getItem("boboOrders") || "[]"
  );

  orders.push({
    date: new Date().toLocaleString(),
    name,
    phone,
    address,
    payment,
    items: [...cart],
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    status: "Pending"
  });

  localStorage.setItem("boboOrders", JSON.stringify(orders));

  const text = orderText(name, phone, address, payment);

  window.open(
    "https://wa.me/94702307435?text=" + text,
    "_blank"
  );

  alert("Order saved! WhatsApp will open with your order details.");

  cart = [];
  save();
  closeOrder();
  closeCart();
}

function whatsappOrder() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  document.getElementById("orderModal").classList.remove("hidden");
}

function buyNow() {
  addToCart(1);
  openCart();
}

document.getElementById("cartBtn").addEventListener("click", openCart);

updateCount();
