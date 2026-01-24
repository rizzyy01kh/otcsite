console.log("🔥 store.js loaded");

// ================= SUPABASE =================
const SUPABASE_URL = "https://trzgvsijzhlbujmuhvnx.supabase.co";
const SUPABASE_KEY = "sb_publishable_mLRqvjNmipyV6NOXp4BpUg_HtrpBff7";

// ✅ DO NOT name it `supabase`
const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ================= CONTAINERS =================
const containers = {
  hp: document.getElementById("hp-products"),
  epson: document.getElementById("epson-products"),
  canon: document.getElementById("canon-products"),
  brother: document.getElementById("brother-products"),
  toner: document.getElementById("toner-products"),
  ink: document.getElementById("ink-products")
};

// ================= CARD TEMPLATE =================
function productCard(p) {
  return `
    <div class="product ${p.brand.toLowerCase()} ${p.category}">
      <img src="${p.image || 'https://via.placeholder.com/300'}">
      <h3>${p.name}</h3>
      <span>$${p.price}</span>
      <a class="buy-btn" href="product.html?id=${p.id}">
        Buy
      </a>
    </div>
  `;
}



// ================= LOAD PRODUCTS =================
async function loadStoreProducts() {
  const { data, error } = await db.from("products").select("*");

  if (error) {
    console.error("❌ Supabase error:", error);
    return;
  }

  console.log("📦 products:", data);

  // Clear sections
  Object.values(containers).forEach(el => {
    if (el) el.innerHTML = "";
  });

  // Render products
  data.forEach(p => {
    const brand = p.brand?.toLowerCase();
    const category = p.category?.toLowerCase();

    if (containers[brand]) {
      containers[brand].innerHTML += productCard(p);
    }

    if (containers[category]) {
      containers[category].innerHTML += productCard(p);
    }
  });
}

// ================= START AFTER DOM =================
document.addEventListener("DOMContentLoaded", loadStoreProducts);
