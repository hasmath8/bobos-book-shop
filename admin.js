const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_PUBLISHABLE_KEY";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function getOrders(){
  const { data, error } = await supabaseClient
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if(error){
    console.error(error);
    alert("Could not load orders.");
    return [];
  }

  return data || [];
}

async function render(){
  const orders = await getOrders();

  document.getElementById("orderCount").textContent = orders.length;

  const total = orders.reduce(
    (s,o) => s + Number(o.total || 0),
    0
  );

  document.getElementById("salesTotal").textContent =
    "LKR " + total.toLocaleString();

  const box = document.getElementById("orders");

  if(!orders.length){
    box.innerHTML =
      "<p>No orders yet. Orders placed from the store will appear here.</p>";
    return;
  }

  box.innerHTML = orders.map(o => `
    <div class="order">
      <div class="order-head">
        <strong>Order</strong>
        <span>${o.created_at || ""}</span>
      </div>

      <p>
        👤 <b>${esc(o.Customer_name)}</b><br>
        📞 ${esc(o.Phone)}<br>
        📍 ${esc(o.address)}<br>
        💳 ${esc(o.payment_method)}
      </p>

      <p>
        📚 ${
          Array.isArray(o.items)
          ? o.items.map(x => esc(x.title) + " × " + x.qty).join("<br>")
          : ""
        }
      </p>

      <p>
        💰 <b>LKR ${Number(o.total || 0).toLocaleString()}</b>
      </p>

      <label>
        Status:
        <select onchange="setStatus('${o.id}', this.value)">
          ${["Pending","Confirmed","Shipped","Delivered","Cancelled"]
            .map(s =>
              `<option ${((o.status || "Pending") === s) ? "selected" : ""}>${s}</option>`
            ).join("")}
        </select>
      </label>
    </div>
  `).join("");
}

async function setStatus(id, status){
  const { error } = await supabaseClient
    .from("orders")
    .update({ status: status })
    .eq("id", id);

  if(error){
    console.error(error);
    alert("Could not update status.");
    return;
  }

  render();
}

async function clearOrders(){
  if(!confirm("Delete all saved orders?")) return;

  const { error } = await supabaseClient
    .from("orders")
    .delete()
    .neq("id", 0);

  if(error){
    console.error(error);
    alert("Could not delete orders.");
    return;
  }

  render();
}

function esc(v){
  return String(v ?? "").replace(
    /[&<>"']/g,
    m => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[m])
  );
}

render();
