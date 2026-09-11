import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaMoneyBillWave,
  FaWallet,
  FaCheckCircle,
  FaPaw,
  FaShoppingCart,
} from "react-icons/fa";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
    notes: "",
  });

  // ============================================================
  // AMBIL DATA USER & CART SAAT MOUNT
  // ============================================================
  useEffect(() => {
    // ---------- 1. AUTO-FILL ALAMAT & NOMOR HP ----------
    try {
      const rawUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (rawUser) {
        const user = JSON.parse(rawUser);

        setForm((prev) => ({
          ...prev,
          address: user.alamat || prev.address,
          phone: user.no_telpon || prev.phone,
        }));

        console.log("=================================");
        console.log("AUTO-FILL CHECKOUT DARI USER:");
        console.log("Alamat  :", user.alamat);
        console.log("Telepon :", user.no_telpon);
        console.log("=================================");
      }
    } catch (err) {
      console.error("Gagal parse user dari localStorage:", err);
    }

    // ---------- 2. AMBIL CART ----------
    const savedCart = JSON.parse(localStorage.getItem("checkoutCart"));
    if (Array.isArray(savedCart) && savedCart.length > 0) {
      setCartItems(savedCart);
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  // ============================================================
  // FORMAT RUPIAH
  // ============================================================
  const formatRupiah = (value) => {
    return Number(value || 0).toLocaleString("id-ID");
  };

  const totalHarga = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  // ============================================================
  // SANITASI NOTES
  // ============================================================
  const sanitizeNotes = (value) => {
    return value.replace(/[^a-zA-Z0-9\s.,?!\-']/g, "");
  };

  // ============================================================
  // HANDLE CHANGE
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "postalCode" || name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    if (name === "notes") {
      const cleanNotes = sanitizeNotes(value);
      setForm((prev) => ({ ...prev, [name]: cleanNotes }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================
  // CEGAH HURUF / SIMBOL DI POSTAL & PHONE
  // ============================================================
  const handleKeyPress = (e) => {
    const { name } = e.target;
    if (name === "postalCode" || name === "phone") {
      const key = e.key;
      if (
        !/^[0-9]$/.test(key) &&
        key !== "Backspace" &&
        key !== "Delete" &&
        key !== "ArrowLeft" &&
        key !== "ArrowRight" &&
        key !== "ArrowUp" &&
        key !== "ArrowDown" &&
        key !== "Tab" &&
        key !== "Enter"
      ) {
        e.preventDefault();
      }
    }
  };

  // ============================================================
  // SUBMIT ORDER
  // ============================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.address || !form.city || !form.phone) {
      alert("Harap isi alamat, kota, dan nomor telepon.");
      return;
    }
    if (form.phone.length < 10) {
      alert("Nomor telepon minimal 10 digit.");
      return;
    }
    if (form.postalCode && form.postalCode.length < 5) {
      alert("Kode pos minimal 5 digit (jika diisi).");
      return;
    }
    if (!/^\d+$/.test(form.phone)) {
      alert("Nomor telepon hanya boleh berisi angka.");
      return;
    }
    if (form.postalCode && !/^\d+$/.test(form.postalCode)) {
      alert("Kode pos hanya boleh berisi angka.");
      return;
    }

    const order = {
      id: Date.now().toString(),
      items: cartItems,
      total: totalHarga,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      phone: form.phone,
      paymentMethod: form.paymentMethod === "cod" ? "COD" : "E-Wallet",
      notes: form.notes,
      status: "menunggu",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = [order, ...existingOrders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutCart");

    navigate("/order-success", { state: { orderId: order.id } });
  };

  // ============================================================
  // KOSONG
  // ============================================================
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-cart">
            <div className="empty-icon"><FaShoppingCart /></div>
            <h3>Keranjang kosong</h3>
            <p>Tambahkan produk ke keranjang terlebih dahulu.</p>
            <Link to="/cart" className="btn-back-shop">Kembali ke Keranjang</Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/cart" className="back-btn">
            <FaArrowLeft /> Kembali
          </Link>
          <h2><FaPaw className="header-icon" /> Checkout</h2>
        </div>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3><FaPaw className="section-icon" /> Alamat Pengiriman</h3>
              <div className="form-group">
                <label>Alamat Lengkap *</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Contoh: Jl. Merdeka No. 12, RT 05 RW 03, Kelurahan Sukamaju"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Kota *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Jakarta Selatan"
                  />
                </div>
                <div className="form-group">
                  <label>Kode Pos</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Contoh: 12345"
                    maxLength="10"
                    title="Hanya angka"
                    autoComplete="postal-code"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Nomor Telepon *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  required
                  placeholder="Contoh: 081234567890"
                  maxLength="15"
                  title="Hanya angka, minimal 10 digit"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="form-section">
              <h3><FaWallet className="section-icon" /> Metode Pembayaran</h3>
              <div className="payment-options">
                <label className={`payment-option ${form.paymentMethod === "cod" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <FaMoneyBillWave className="option-icon" />
                  <span className="option-label">COD (Bayar di Tempat)</span>
                  <span className="option-sub">✓</span>
                </label>
                <label className={`payment-option ${form.paymentMethod === "ewallet" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ewallet"
                    checked={form.paymentMethod === "ewallet"}
                    onChange={handleChange}
                  />
                  <FaWallet className="option-icon" />
                  <span className="option-label">E-Wallet (OVO, Gopay, Dana, LinkAja)</span>
                  <span className="option-sub">✓</span>
                </label>
              </div>
              <p className="payment-note">
                {form.paymentMethod === "cod"
                  ? "Pembayaran dilakukan saat barang tiba di alamat Anda."
                  : "Anda akan diarahkan ke aplikasi E-Wallet untuk menyelesaikan pembayaran."}
              </p>
            </div>

            <div className="form-section">
              <h3><FaCreditCard className="section-icon" /> Catatan (Opsional)</h3>
              <div className="form-group">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Tambahkan catatan untuk kurir atau penjual, misal: 'Titipkan di depan pintu pagar' atau 'Hubungi via WA sebelum sampai'"
                />
                <small className="notes-hint">Hanya huruf, angka, spasi, dan tanda baca dasar (.,?!-')</small>
              </div>
            </div>

            <button type="submit" className="btn-confirm">
              <FaCheckCircle /> Buat Pesanan
            </button>
          </form>

          <div className="checkout-summary">
            <h3><FaPaw className="section-icon" /> Ringkasan Pesanan</h3>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <span>
                      {item.quantity} x Rp {formatRupiah(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="checkout-total">
              <span>Total</span>
              <strong>Rp {formatRupiah(totalHarga)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;