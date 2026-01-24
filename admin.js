import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔑 Supabase config
const SUPABASE_URL = "https://trzgvsijzhlbujmuhvnx.supabase.co";
const SUPABASE_KEY = "sb_publishable_mLRqvjNmipyV6NOXp4BpUg_HtrpBff7";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🧩 DOM elements
const grid = document.getElementById("productGrid");
const modal = document.getElementById("modal");

const nameInput = document.getElementById("name");
const brandInput = document.getElementById("brand");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const imageInput = document.getElementById("image");
const editIdInput = document.getElementById("editId");

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  grid.innerHTML = "";

  data.forEach(p => {
    grid.innerHTML += `
      <div class="card">
        <img src="${p.image || "https://via.placeholder.com/300"}">
        <div class="card-body">
          <strong>${p.name}</strong>
          <div>${p.brand} • ${p.category}</div>
          <div class="price">$${p.price}</div>
          <div>${p.stock} in stock</div>
          <br>
          <button class="warning" onclick="editProduct('${p.id}')">Edit</button>
          <button class="danger" onclick="deleteProduct('${p.id}')">Delete</button>
        </div>
      </div>
    `;
  });
}

// ================= MODAL =================
function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
  clearForm();
}

// ================= SAVE / UPDATE PRODUCT =================
async function saveProduct() {
  let imageUrl;

  // 📷 Upload image only if selected
  if (imageInput.files[0]) {
    const file = imageInput.files[0];
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase
      .storage
      .from("products")
      .upload(fileName, file);

    if (uploadError) {
      alert("Image upload failed");
      return;
    }

    imageUrl = supabase
      .storage
      .from("products")
      .getPublicUrl(fileName)
      .data
      .publicUrl;
  }

  const payload = {
    name: nameInput.value.trim(),
    brand: brandInput.value.trim(),
    category: categoryInput.value.trim(),
    price: Number(priceInput.value),
    stock: Number(stockInput.value),
  };

  // ✅ Only update image if new one uploaded
  if (imageUrl) payload.image = imageUrl;

  if (editIdInput.value) {
    // UPDATE
    await supabase
      .from("products")
      .update(payload)
      .eq("id", editIdInput.value);
  } else {
    // INSERT
    await supabase
      .from("products")
      .insert({ ...payload, image: imageUrl });
  }

  closeModal();
  loadProducts();
}

// ================= EDIT PRODUCT =================
async function editProduct(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  nameInput.value = data.name;
  brandInput.value = data.brand;
  categoryInput.value = data.category;
  priceInput.value = data.price;
  stockInput.value = data.stock;
  editIdInput.value = data.id;

  openModal();
}

// ================= DELETE PRODUCT =================
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  await supabase
    .from("products")
    .delete()
    .eq("id", id);

  loadProducts();
}

// ================= CLEAR FORM =================
function clearForm() {
  nameInput.value = "";
  brandInput.value = "";
  categoryInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
  imageInput.value = "";
  editIdInput.value = "";
}

// ================= INIT =================
loadProducts();
