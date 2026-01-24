// ================= SUPABASE =================
const SUPABASE_URL = "https://trzgvsijzhlbujmuhvnx.supabase.co";
const SUPABASE_KEY = "sb_publishable_mLRqvjNmipyV6NOXp4BpUg_HtrpBff7";

// IMPORTANT: do NOT redeclare supabase
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ================= GET ID =================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const container = document.getElementById("product");

if (!productId) {
  container.innerHTML = "<p>Product not found</p>";
  throw new Error("Missing product ID");
}

// ================= LOAD PRODUCT =================
async function loadProduct() {
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading product</p>";
    return;
  }

  container.innerHTML = `
    <div>
      <img src="${data.image_url}" alt="${data.name}">
    </div>

    <div class="product-info">
      <h1>${data.name}</h1>
      <div class="price">$${data.price}</div>

      <div class="specs">
        <p><strong>Brand:</strong> ${data.brand}</p>
        <p><strong>Type:</strong> ${data.type}</p>
        <p><strong>Paper Size:</strong> ${data.paper_size}</p>
        <p><strong>Speed:</strong> ${data.speed}</p>
        <p><strong>Resolution:</strong> ${data.resolution}</p>
      </div>

      <p>${data.description}</p>

      <div class="actions">
        <a class="telegram"
           href="https://t.me/OTCTECHNOLOGY?text=សួរស្តី! ខ្ញ៉ំចង់សួរពត៏មានអំពី ${encodeURIComponent(data.name)}"
           target="_blank">
           Contact Telegram
        </a>

        <a class="buy" href="#" onclick="alert('Add checkout later')">
           Buy Now
        </a>
      </div>
    </div>
  `;
}

// ================= RUN =================
loadProduct();
