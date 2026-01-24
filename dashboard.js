// ================= SUPABASE =================
const client = supabase.createClient(
  "https://trzgvsijzhlbujmuhvnx.supabase.co",
  "sb_publishable_mLRqvjNmipyV6NOXp4BpUg_HtrpBff7"
);

// ================= ELEMENTS =================
const table = document.getElementById("table");
const saveBtn = document.getElementById("saveBtn");

const nameInput = document.getElementById("name");
const brandInput = document.getElementById("brand");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const imageInput = document.getElementById("imageFile");

// MODAL
const editModal = document.getElementById("editModal");
const m_name = document.getElementById("m_name");
const m_brand = document.getElementById("m_brand");
const m_category = document.getElementById("m_category");
const m_price = document.getElementById("m_price");
const m_stock = document.getElementById("m_stock");
const m_image = document.getElementById("m_image");
const m_preview = document.getElementById("m_preview");

// STATE
let editId = null;
let currentEditImage = "";

// ================= VALIDATION =================
function canSave() {
  return (
    nameInput.value.trim() &&
    brandInput.value &&
    categoryInput.value &&
    priceInput.value &&
    stockInput.value
  );
}

function toggleSaveButton() {
  saveBtn.disabled = !canSave();
}

[nameInput, brandInput, categoryInput, priceInput, stockInput]
  .forEach(el => el.addEventListener("input", toggleSaveButton));

// ================= IMAGE UPLOAD =================
async function uploadImage(file) {
  if (!file) return "";

  const fileName = Date.now() + "-" + file.name;

  const { error } = await client.storage
    .from("products")
    .upload(fileName, file, { upsert: true });

  if (error) {
    alert("Image upload failed: " + error.message);
    return "";
  }

  return client.storage
    .from("products")
    .getPublicUrl(fileName).data.publicUrl;
}

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  const { data, error } = await client
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  table.innerHTML = "";

  data.forEach(p => {
    table.innerHTML += `
      <tr>
        <td><img src="${p.image || "https://via.placeholder.com/60"}"></td>
        <td>${p.name}</td>
        <td>${p.brand}</td>
        <td>${p.category}</td>
        <td>${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button class="warning" onclick="openEdit('${p.id}')">Edit</button>
          <button class="danger" onclick="deleteProduct('${p.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ================= ADD PRODUCT =================
saveBtn.onclick = async () => {
  let imageUrl = "";
  if (imageInput.files[0]) {
    imageUrl = await uploadImage(imageInput.files[0]);
  }

  const { error } = await client.from("products").insert({
    name: nameInput.value.trim(),
    brand: brandInput.value,
    category: categoryInput.value,
    price: Number(priceInput.value),
    stock: Number(stockInput.value),
    image: imageUrl
  });

  if (error) {
    alert("Insert failed: " + error.message);
    return;
  }

  nameInput.value = "";
  brandInput.value = "";
  categoryInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
  imageInput.value = "";

  toggleSaveButton();
  loadProducts();
};

// ================= OPEN EDIT =================
async function openEdit(id) {
  const { data } = await client.from("products").select("*").eq("id", id).single();

  editId = id;
  currentEditImage = data.image || "";

  m_name.value = data.name;
  m_brand.value = data.brand;
  m_category.value = data.category;
  m_price.value = data.price;
  m_stock.value = data.stock;

  m_preview.src = currentEditImage || "https://via.placeholder.com/120";
  m_image.value = "";

  m_image.onchange = () => {
    if (m_image.files[0]) {
      m_preview.src = URL.createObjectURL(m_image.files[0]);
    }
  };

  editModal.style.display = "flex";
}

// ================= SAVE EDIT =================
async function saveEdit() {
  let finalImage = currentEditImage;

  if (m_image.files[0]) {
    finalImage = await uploadImage(m_image.files[0]);
  }

  await client.from("products").update({
    name: m_name.value.trim(),
    brand: m_brand.value,
    category: m_category.value,
    price: Number(m_price.value),
    stock: Number(m_stock.value),
    image: finalImage
  }).eq("id", editId);

  closeEdit();
  loadProducts();
}

// ================= CLOSE EDIT =================
function closeEdit() {
  editModal.style.display = "none";
}

// ================= DELETE =================
async function deleteProduct(id) {
  if (!confirm("Delete product?")) return;
  await client.from("products").delete().eq("id", id);
  loadProducts();
}

// ================= INIT =================
toggleSaveButton();
loadProducts();
