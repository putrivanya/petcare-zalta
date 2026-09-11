import { useEffect, useState } from "react";
import "./UserDashboard.css";

const API_URL = "http://localhost:5000/api";

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Gagal mengambil data produk");
      }

      const data = await response.json();

      console.log("DATA PRODUK:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
      setError("Produk gagal dimuat dari server.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const categories = [
    { name: "Semua", icon: "🐾" },
    { name: "Makanan", icon: "🥩" },
    { name: "Treats", icon: "🦴" },
    { name: "Mainan", icon: "🧸" },
    { name: "Kandang", icon: "🏠" },
    { name: "Grooming", icon: "🧴" },
    { name: "Vitamin", icon: "💊" },
  ];

  const filteredProducts = products.filter((product) => {
    const productName = product.name?.toLowerCase() || "";
    const productCategory = product.category?.toLowerCase() || "";

    const matchesSearch =
      productName.includes(search.toLowerCase()) ||
      productCategory.includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua" ||
      productCategory === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="user-dashboard">

      {/* ================= NAVBAR ================= */}

      <header className="user-header">

        <div className="header-top">

          <div className="zalta-logo">
            <div className="logo-icon">🐾</div>

            <div className="logo-text">
              <h2>PetCare Hub</h2>
              <span>ZALTA</span>
            </div>
          </div>

          <div className="search-box">

            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Cari kebutuhan hewan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="header-icons">

            <button title="Keranjang">
              🛒
            </button>

            <button title="Notifikasi">
              🔔
            </button>

            <button className="profile-icon" title="Profile">
              👤
            </button>

          </div>

        </div>

        <nav className="user-navigation">

          <a href="#beranda">Beranda</a>

          <a href="#produk">Produk</a>

          <a href="#kategori">Kategori</a>

          <a href="#layanan">Layanan</a>

          <a href="#dokter">Dokter Hewan</a>

          <a href="#adopsi">Adopsi</a>

          <a href="#hotel">Pet Hotel</a>

        </nav>

      </header>


      {/* ================= BANNER ================= */}

      <section className="zalta-banner" id="beranda">

        <div className="banner-left">

          <span className="banner-label">
            🐾 PETCARE HUB ZALTA
          </span>

          <h1>
            Semua Kebutuhan Hewan
            <br />
            <span>Ada di Sini!</span>
          </h1>

          <p>
            Temukan makanan, perlengkapan, perawatan,
            kesehatan, hingga layanan terbaik untuk
            hewan kesayanganmu.
          </p>

          <div className="banner-buttons">

            <a href="#produk">
              Belanja Sekarang
            </a>

            <a href="#layanan" className="outline-button">
              Lihat Layanan
            </a>

          </div>

        </div>


        <div className="banner-right">

          <div className="big-pet">
            🐶
          </div>

          <div className="small-pet cat">
            🐱
          </div>

          <div className="small-pet rabbit">
            🐰
          </div>

          <span className="banner-paw paw-one">
            🐾
          </span>

          <span className="banner-paw paw-two">
            🐾
          </span>

        </div>

      </section>


      {/* ================= PET CATEGORY ================= */}

      <section className="pet-category" id="kategori">

        <div className="section-heading">

          <div>
            <span>UNTUK SEMUA SAHABAT BULU</span>

            <h2>
              Pilih Berdasarkan Hewan
            </h2>
          </div>

        </div>


        <div className="pet-grid">

          <div className="pet-card">
            <div className="pet-picture dog">
              🐶
            </div>

            <h3>Anjing</h3>

            <p>
              Kebutuhan untuk anjing
            </p>
          </div>


          <div className="pet-card">
            <div className="pet-picture cat">
              🐱
            </div>

            <h3>Kucing</h3>

            <p>
              Kebutuhan untuk kucing
            </p>
          </div>


          <div className="pet-card">
            <div className="pet-picture rabbit">
              🐰
            </div>

            <h3>Kelinci</h3>

            <p>
              Kebutuhan untuk kelinci
            </p>
          </div>


          <div className="pet-card">
            <div className="pet-picture other">
              🐹
            </div>

            <h3>Hewan Kecil</h3>

            <p>
              Kebutuhan hewan kecil
            </p>
          </div>

        </div>

      </section>


      {/* ================= PRODUCT CATEGORY ================= */}

      <section className="category-section">

        <div className="section-heading">

          <div>
            <span>JELAJAHI PRODUK</span>

            <h2>
              Kategori Produk
            </h2>
          </div>

        </div>


        <div className="category-grid">

          {categories.map((category) => (

            <button
              key={category.name}
              className={
                selectedCategory === category.name
                  ? "category-item active"
                  : "category-item"
              }
              onClick={() =>
                setSelectedCategory(category.name)
              }
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <span>
                {category.name}
              </span>

            </button>

          ))}

        </div>

      </section>


      {/* ================= PRODUCTS ================= */}

      <section className="product-section" id="produk">

        <div className="section-heading product-heading">

          <div>
            <span>PRODUK TERBAIK UNTUK HEWANMU</span>

            <h2>
              Produk Pilihan
            </h2>
          </div>

          <span className="product-count">
            {filteredProducts.length} Produk
          </span>

        </div>


        {loading && (

          <div className="status-box">

            <div className="loading-circle"></div>

            <p>
              Sedang memuat produk...
            </p>

          </div>

        )}


        {!loading && error && (

          <div className="status-box error">

            <div>⚠️</div>

            <p>{error}</p>

            <button onClick={fetchProducts}>
              Coba Lagi
            </button>

          </div>

        )}


        {!loading &&
          !error &&
          filteredProducts.length === 0 && (

            <div className="status-box">

              <div className="empty-icon">
                🐾
              </div>

              <h3>
                Produk tidak ditemukan
              </h3>

              <p>
                Coba cari produk atau kategori lainnya.
              </p>

            </div>

          )}


        {!loading &&
          !error &&
          filteredProducts.length > 0 && (

            <div className="product-grid">

              {filteredProducts.map((product) => (

                <div
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-image">

                    {product.badge && (
                      <span className="product-badge">
                        {product.badge}
                      </span>
                    )}

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                    ) : (

                      <div className="default-product-image">
                        🐾
                      </div>

                    )}

                    <button
                      className="heart-button"
                      title="Favorit"
                    >
                      ♡
                    </button>

                  </div>


                  <div className="product-information">

                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <div className="stars">
                      ⭐⭐⭐⭐⭐
                    </div>

                    <div className="product-footer">

                      <strong>
                        {formatPrice(product.price)}
                      </strong>

                      <button
                        className="cart-button"
                        title="Tambah ke keranjang"
                      >
                        🛒
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

      </section>


      {/* ================= SERVICES ================= */}

      <section
        className="service-section"
        id="layanan"
      >

        <div className="section-heading centered">

          <span>
            LEBIH DARI SEKADAR PET SHOP
          </span>

          <h2>
            Semua Layanan Hewan Ada di Zalta
          </h2>

          <p>
            Kami membantu memenuhi kebutuhan hewanmu
            dari kebutuhan sehari-hari sampai perawatan.
          </p>

        </div>


        <div className="service-grid">

          <div className="service-card">

            <div className="service-icon">
              ✂️
            </div>

            <h3>
              Pet Grooming
            </h3>

            <p>
              Perawatan bulu, kuku, mandi dan
              kebersihan hewan kesayangan.
            </p>

            <button>
              Lihat Grooming →
            </button>

          </div>


          <div
            className="service-card"
            id="dokter"
          >

            <div className="service-icon">
              🩺
            </div>

            <h3>
              Dokter Hewan
            </h3>

            <p>
              Konsultasi kesehatan dan pemeriksaan
              hewan bersama dokter.
            </p>

            <button>
              Konsultasi →
            </button>

          </div>


          <div
            className="service-card"
            id="hotel"
          >

            <div className="service-icon">
              🏨
            </div>

            <h3>
              Pet Hotel
            </h3>

            <p>
              Tempat nyaman dan aman untuk
              menitipkan hewan.
            </p>

            <button>
              Lihat Hotel →
            </button>

          </div>


          <div className="service-card">

            <div className="service-icon">
              🐾
            </div>

            <h3>
              Adopsi
            </h3>

            <p>
              Temukan sahabat baru dan berikan
              rumah penuh kasih.
            </p>

            <button>
              Lihat Adopsi →
            </button>

          </div>

        </div>

      </section>


      {/* ================= ADOPTION ================= */}

      <section
        className="adoption-section"
        id="adopsi"
      >

        <div className="adoption-content">

          <div>

            <span>
              ❤️ ADOPSI HEWAN
            </span>

            <h2>
              Temukan Sahabat
              <br />
              Baru Untukmu
            </h2>

            <p>
              Berikan rumah penuh kasih kepada hewan
              yang membutuhkan keluarga baru.
            </p>

            <button>
              Lihat Hewan Adopsi →
            </button>

          </div>


          <div className="adoption-animals">
            🐶 🐱 🐰
          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="user-footer">

        <div className="footer-content">

          <div className="footer-brand">

            <h2>
              🐾 PetCare Hub Zalta
            </h2>

            <p>
              Semua kebutuhan hewan
              dalam satu tempat.
            </p>

          </div>


          <div className="footer-column">

            <h3>
              Belanja
            </h3>

            <a href="#produk">
              Produk
            </a>

            <a href="#kategori">
              Kategori
            </a>

          </div>


          <div className="footer-column">

            <h3>
              Layanan
            </h3>

            <a href="#layanan">
              Grooming
            </a>

            <a href="#dokter">
              Dokter Hewan
            </a>

            <a href="#hotel">
              Pet Hotel
            </a>

          </div>


          <div className="footer-column">

            <h3>
              PetCare Hub
            </h3>

            <a href="#adopsi">
              Adopsi
            </a>

            <a href="#beranda">
              Tentang Kami
            </a>

            <a href="#beranda">
              Kontak
            </a>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 PetCare Hub Zalta.
            Semua Hak Dilindungi.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default UserDashboard;