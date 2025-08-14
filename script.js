const products = []; // Array untuk menyimpan semua produk
const itemsPerPage = 1; // Jumlah item per halaman
let currentPage = 1; // Halaman aktif

// Fungsi untuk mengambil data dari Fake Store API
// Fungsi untuk mengambil data dari Fake Store API
// Fungsi untuk mengambil data dari Fake Store API
async function fetchAPIData() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Failed to fetch data from API");
    }

    const apiData = await response.json();

    // Jika data berupa array
    if (Array.isArray(apiData)) {
      apiData.forEach((item) => {
        products.unshift(mapProduct(item));
      });
    } 
    // Jika data berupa objek tunggal
    else {
      products.unshift(mapProduct(apiData));
    }

    renderProducts();
  } catch (error) {
    console.error("Error fetching API data:", error);
    alert("Failed to fetch data from API. Please try again later.");
  }
}

// Fungsi untuk mapping data API ke format produk lokal
function mapProduct(item) {
  return {
    name: item.title,
    stock: "In stock",
    price: item.price,
    desc: item.description,
    qty: Math.floor(Math.random() * 50) + 1,
    color: "Biru",
    material: "Kulit",
    brand: "Adidas",
    image: item.image,
  };
}


// Fungsi untuk validasi input angka
function validateNumberInput() {
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  if (isNaN(price) || price <= 0) {
    alert("Price harus berupa angka positif.");
    return false;
  }

  if (isNaN(quantity) || quantity <= 0) {
    alert("Quantity harus berupa angka positif.");
    return false;
  }

  return true;
}

// Fungsi untuk mengatur input Quantity berdasarkan status stok
function toggleSaveButton() {
  const stockStatus = document.getElementById("stockStatus").value;
  const quantityInput = document.getElementById("quantity");

  if (stockStatus === "Out of stock") {
    quantityInput.disabled = true; // Nonaktifkan input Quantity
  } else {
    quantityInput.disabled = false; // Aktifkan input Quantity
  }
}

// Event listener untuk mengubah status input Quantity
document.getElementById("stockStatus").addEventListener("change", toggleSaveButton);

function submitForm(event) {
  event.preventDefault();

  // Validasi angka untuk price dan quantity
  if (!validateNumberInput()) {
    return;
  }

  const defaultImage = "https://i.imgur.com/Nr1J6Yq.png"; // Hoodie default

  const name = document.getElementById("productName").value.trim();
  const stock = document.getElementById("stockStatus").value.trim();
  const price = document.getElementById("price").value.trim();
  const desc = document.getElementById("description").value.trim();
  const qty = document.getElementById("quantity").value.trim();
  const color = document.getElementById("color").value.trim();
  const material = document.getElementById("material").value.trim();
  const brand = document.getElementById("brand").value.trim();
  const image = document.getElementById("imageUrl").value.trim() || defaultImage;

  // Validasi input
  if (!name || !stock || !price || !desc || !qty || !color || !material || !brand) {
    alert("Data isian belum lengkap. Mohon isi semua kolom yang wajib diisi.");
    return;
  }

  // Tambahkan produk ke array (paling awal)
  products.unshift({
    name,
    stock,
    price,
    desc,
    qty,
    color,
    material,
    brand,
    image,
  });

  // Reset form setelah submit
  document.getElementById("productForm").reset();

  // Tampilkan produk
  renderProducts();
}

function renderProducts() {
  const productDisplayContainer = document.getElementById("productDisplayContainer");
  productDisplayContainer.innerHTML = ""; // Bersihkan kontainer

  // Hitung indeks awal dan akhir untuk halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Ambil produk untuk halaman saat ini
  const currentProducts = products.slice(startIndex, endIndex);

  // Tampilkan produk
  currentProducts.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.className = "col-12 mb-3"; // Satu baris penuh
    productCard.innerHTML = `
      <div class="card p-3">
        <h6 class="fw-bold">${product.name}</h6>
        <img src="${product.image}" alt="Product Image" class="img-fluid mb-3 d-block mx-auto" style="max-width:250px;">
        <p class="text-success fw-bold">${product.stock}</p>
        <p class="fw-bold">Rp ${parseFloat(product.price).toLocaleString()} /per pcs</p>
        <p>${product.desc}</p>
        <p><strong>Quantity:</strong> ${product.qty}</p>
        <p><strong>Color:</strong> ${product.color}</p>
        <p><strong>Material:</strong> ${product.material}</p>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-warning btn-sm" onclick="editProduct(${startIndex + index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${startIndex + index})">Delete</button>
        </div>
      </div>
    `;
    productDisplayContainer.appendChild(productCard);
  });

  // Render pagination
  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Bersihkan pagination

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const maxVisiblePages = 10; // Maksimal tombol pagination yang ditampilkan
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Pastikan jumlah tombol pagination tidak melebihi batas
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Tombol "Previous"
  if (currentPage > 1) {
    const prevItem = document.createElement("li");
    prevItem.className = "page-item";
    prevItem.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevItem.addEventListener("click", () => {
      currentPage--;
      renderProducts();
    });
    pagination.appendChild(prevItem);
  }

  // Tombol halaman
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageItem.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
    });
    pagination.appendChild(pageItem);
  }

  // Tombol "Next"
  if (currentPage < totalPages) {
    const nextItem = document.createElement("li");
    nextItem.className = "page-item";
    nextItem.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextItem.addEventListener("click", () => {
      currentPage++;
      renderProducts();
    });
    pagination.appendChild(nextItem);
  }
}

function deleteProduct(index) {
  products.splice(index, 1); // Hapus produk dari array
  renderProducts(); // Perbarui tampilan
}

function editProduct(index) {
  const product = products[index];
  document.getElementById("productName").value = product.name;
  document.getElementById("stockStatus").value = product.stock;
  document.getElementById("price").value = product.price;
  document.getElementById("description").value = product.desc;
  document.getElementById("quantity").value = product.qty;
  document.getElementById("color").value = product.color;
  document.getElementById("material").value = product.material;
  document.getElementById("brand").value = product.brand;
  document.getElementById("imageUrl").value = product.image;

  // Hapus produk lama dari array
  deleteProduct(index);
}

// Inisialisasi input Quantity saat halaman dimuat
toggleSaveButton();

// Ambil data dari API saat halaman dimuat
fetchAPIData();