import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kategori yang tampil di halaman user
  const categories = [
    {
      name: "Semua",
      value: "all",
      icon: "🐾",
    },
    {
      name: "Makanan",
      value: "makanan",
      icon: "🥩",
    },
    {
      name: "Treats",
      value: "treats",
      icon: "🦴",
    },
    {
      name: "Mainan",
      value: "mainan",
      icon: "🧸",
    },
    {
      name: "Kandang",
      value: "kandang",
      icon: "🏠",
    },
    {
      name: "Grooming",
      value: "grooming",
      icon: "🧴",
    },
    {
      name: "Vitamin",
      value: "vitamin",
      icon: "💊",
    },
  ];

  // Kategori yang sedang dipilih
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Ambil produk dari backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      console.log("DATA PRODUK DARI BACKEND:", response.data);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        "Gagal mengambil produk:",
        error.response?.data || error.message
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER PRODUK
  // ==========================================

  const filteredProducts = products.filter((product) => {
    // Kalau pilih SEMUA
    if (selectedCategory === "all") {
      return true;
    }

    // Ambil category dari database
    const productCategory = String(product.category || "")
      .trim()
      .toLowerCase();

    // Cocokkan dengan kategori yang dipilih
    return productCategory === selectedCategory;
  });

  return (
    <div className="shop-container">

      {/* ======================================
          BAGIAN KATEGORI
      ====================================== */}

      <section className="category-section">

        <div className="category-title">
          <span>JELAJAHI PRODUK</span>

          <h2>Kategori Produk</h2>
        </div>

        <div className="category-list">

          {categories.map((category) => (

            <button
              key={category.value}
              type="button"
              className={`category-card ${
                selectedCategory === category.value
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(category.value)
              }
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <div className="category-name">
                {category.name}
              </div>

            </button>

          ))}

        </div>

      </section>


      {/* ======================================
          PRODUK
      ====================================== */}

      <section className="products-section">

        <div className="products-heading">

          <div>

            <span>PRODUK TERBAIK</span>

            <h2>
              {selectedCategory === "all"
                ? "Produk Pilihan"
                : `Produk ${categories.find(
                    (item) =>
                      item.value === selectedCategory
                  )?.name || ""}`}
            </h2>

          </div>

          <strong>
            {filteredProducts.length} Produk
          </strong>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="empty-product">
            <p>Memuat produk...</p>
          </div>
        )}


        {/* TIDAK ADA PRODUK */}

        {!loading && filteredProducts.length === 0 && (

          <div className="empty-product">

            <div style={{ fontSize: "50px" }}>
              🐾
            </div>

            <h3>
              Belum ada produk
            </h3>

            <p>
              Belum ada produk untuk kategori ini.
            </p>

          </div>

        )}


        {/* LIST PRODUK */}

        {!loading && filteredProducts.length > 0 && (

          <div className="product-grid">

            {filteredProducts.map((item) => (

              <div
                className="product-card"
                key={item.id}
              >

                {/* BADGE */}

                {item.badge && (
                  <div className="product-badge">
                    {item.badge}
                  </div>
                )}


                {/* GAMBAR */}

                <div className="product-image">

                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/300x250?text=PetCare"
                    }
                    alt={item.name}
                  />

                </div>


                {/* INFORMASI */}

                <div className="product-info">

                  <p className="product-category">
                    {item.category}
                  </p>

                  <h3>
                    {item.name}
                  </h3>

                  <p className="product-price">
                    Rp{" "}
                    {Number(
                      item.price || 0
                    ).toLocaleString("id-ID")}
                  </p>


                  <button
                    type="button"
                    className="buy-button"
                  >
                    Beli Sekarang
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Shop;