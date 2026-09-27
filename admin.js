function getOrders(){return JSON.parse(localStorage.getItem("boboOrders")||"[]");}
function saveOrders(o){localStorage.setItem("boboOrders",JSON.stringify(o));}
function render(){
 const orders=getOrders();
 document.getElementById("orderCount").textContent=orders.length;
 const total=orders.reduce((s,o)=>s+(o.total||0),0);
 document.getElementById("salesTotal").textContent="LKR "+total.toLocaleString();
 const box=document.getElementById("orders");
 if(!orders.length){box.innerHTML="<p>No orders yet. Orders placed from the store will appear here.</p>";return;}
 box.innerHTML=orders.map((o,i)=>`
 <div class="order">
  <div class="order-head"><strong>Order #${i+1}</strong><span>${o.date||""}</span></div>
  <p>👤 <b>${esc(o.name)}</b><br>📞 ${esc(o.phone)}<br>📍 ${esc(o.address)}<br>💳 ${esc(o.payment)}</p>
  <p>📚 ${o.items.map(x=>esc(x.title)+" × "+x.qty).join("<br>")}</p>
  <p>💰 <b>LKR ${(o.total||0).toLocaleString()}</b></p>
  <label>Status: <select onchange="setStatus(${i},this.value)">
   ${["Pending","Confirmed","Shipped","Delivered","Cancelled"].map(s=>`<option ${((o.status||"Pending")===s)?"selected":""}>${s}</option>`).join("")}
  </select></label>
 </div>`).join("");
}
function setStatus(i,status){const o=getOrders();o[i].status=status;saveOrders(o);render();}
function clearOrders(){if(confirm("Delete all saved orders?")){localStorage.removeItem("boboOrders");render();}}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
render();