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
      <span>${i.title}<br>
      <small>LKR ${i.price.toLocaleString()} × ${i.qty}</small></span>
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

function submitOrder(e) {
  e.preventDefault();
  alert("Order button is working!");
}

function whatsappOrder() {
  checkout();
}

function buyNow() {
  addToCart(1);
  openCart();
}

const cartButton = document.getElementById("cartBtn");

if (cartButton) {
  cartButton.onclick = function () {
    openCart();
  };
}

updateCount();
