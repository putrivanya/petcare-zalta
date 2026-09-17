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
  FaTruck // Icon untuk kurir
} from "react-icons/fa";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
    courier: "jne", // Default kurir
    notes: "",
  });

  // ============================================================
  // AMBIL DATA USER & CART SAAT MOUNT
  // ============================================================
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user") || localStorage.getItem("currentUser");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        setForm((prev) => ({
          ...prev,
          address: user.alamat || prev.address,
          phone: user.no_telpon || prev.phone,
        }));
      }
    } catch (err) {
      console.error("Gagal parse user dari localStorage:", err);
    }

    const savedCart = JSON.parse(localStorage.getItem("checkoutCart"));
    if (Array.isArray(savedCart) && savedCart.length > 0) {
      setCartItems(savedCart);
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  // ============================================================
  // SIMULASI PERHITUNGAN ONGKIR
  // ============================================================
  useEffect(() => {
    // Logika simulasi: Harga ongkir berdasarkan kata kunci kota dan kurir
    const hitungOngkir = () => {
      const cityLower = form.city.toLowerCase();
      let baseCost = 15000; // Ongkir dasar

      if (cityLower.includes("jakarta")) baseCost = 15000;
      else if (cityLower.includes("bandung")) baseCost = 20000;
      else if (cityLower.includes("surabaya")) baseCost = 30000;
      else if (cityLower.includes("medan")) baseCost = 45000;
      else if (cityLower.includes("papua")) baseCost = 75000;
      else if (cityLower.length > 0) baseCost = 25000; // Default jika kota lain diisi

      // Penyesuaian berdasarkan kurir
      if (form.courier === "jne") return baseCost;
      if (form.courier === "jnt") return baseCost + 2000;
      if (form.courier === "sicepat") return baseCost - 1000;
      return baseCost;
    };

    if (form.city) {
      setShippingCost(hitungOngkir());
    } else {
      setShippingCost(0);
    }
  }, [form.city, form.courier]);

  // ============================================================
  // FORMAT RUPIAH & TOTAL
  // ============================================================
  const formatRupiah = (value) => {
    return Number(value || 0).toLocaleString("id-ID");
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );
  
  const grandTotal = subtotal + shippingCost;

  // ============================================================
  // HANDLE CHANGE
  // ============================================================
  const sanitizeNotes = (value) => value.replace(/[^a-zA-Z0-9\s.,?!\-']/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "postalCode" || name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    if (name === "notes") {
      setForm((prev) => ({ ...prev, [name]: sanitizeNotes(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyPress = (e) => {
    const { name } = e.target;
    if (name === "postalCode" || name === "phone") {
      const key = e.key;
      if (!/^[0-9]$/.test(key) && key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Tab" && key !== "Enter") {
        e.preventDefault();
      }
    }
  };

  // ============================================================
  // SUBMIT ORDER (DIPERBARUI)
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

    // Nomor resi TIDAK dibuat di sini, akan diinput oleh Admin
    const order = {
      id: Date.now().toString(),
      items: cartItems,
      subtotal: subtotal,
      shippingCost: shippingCost,
      total: grandTotal,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      phone: form.phone,
      courier: form.courier.toUpperCase(), // Simpan kurir yang dipilih pembeli
      trackingNumber: "", // Dikosongkan, nanti diisi Admin
      paymentMethod: form.paymentMethod === "cod" ? "COD" : "E-Wallet",
      notes: form.notes,
      status: "pending", // Status awal untuk diproses Admin
      statusHistory: [
        { status: "Pesanan Dibuat", time: new Date().toISOString() },
        { status: "Menunggu Konfirmasi", time: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simpan ke localStorage (sementara, sampai terhubung ke Backend API)
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]));

    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutCart");

    // Arahkan ke halaman sukses, bawa ID pesanan
    navigate("/order-success", { state: { orderId: order.id } });
  };

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
            
            {/* ALAMAT PENGIRIMAN */}
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
                  placeholder="Contoh: Jl. Merdeka No. 12, RT 05 RW 03"
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
                />
              </div>
            </div>

            {/* METODE PENGIRIMAN */}
            <div className="form-section">
              <h3><FaTruck className="section-icon" /> Metode Pengiriman</h3>
              <div className="form-group">
                <label>Pilih Kurir *</label>
                <select 
                  name="courier" 
                  value={form.courier} 
                  onChange={handleChange}
                  className="courier-select"
                >
                  <option value="jne">JNE Reguler</option>
                  <option value="jnt">J&T Express</option>
                  <option value="sicepat">SiCepat Halu</option>
                </select>
              </div>
              {form.city && (
                <p className="shipping-info">
                  Estimasi ongkir ke <strong>{form.city}</strong>: Rp {formatRupiah(shippingCost)}
                </p>
              )}
            </div>

            {/* METODE PEMBAYARAN */}
            <div className="form-section">
              <h3><FaWallet className="section-icon" /> Metode Pembayaran</h3>
              <div className="payment-options">
                <label className={`payment-option ${form.paymentMethod === "cod" ? "active" : ""}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === "cod"} onChange={handleChange} />
                  <FaMoneyBillWave className="option-icon" />
                  <span className="option-label">COD (Bayar di Tempat)</span>
                </label>
                <label className={`payment-option ${form.paymentMethod === "ewallet" ? "active" : ""}`}>
                  <input type="radio" name="paymentMethod" value="ewallet" checked={form.paymentMethod === "ewallet"} onChange={handleChange} />
                  <FaWallet className="option-icon" />
                  <span className="option-label">E-Wallet (OVO, Gopay, Dana)</span>
                </label>
              </div>
            </div>

            {/* CATATAN */}
            <div className="form-section">
              <h3><FaCreditCard className="section-icon" /> Catatan (Opsional)</h3>
              <div className="form-group">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Contoh: Titipkan di depan pintu pagar"
                />
              </div>
            </div>

            <button type="submit" className="btn-confirm">
              <FaCheckCircle /> Buat Pesanan
            </button>
          </form>

          {/* RINGKASAN PESANAN */}
          <div className="checkout-summary">
            <h3><FaPaw className="section-icon" /> Ringkasan Pesanan</h3>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <span>{item.quantity} x Rp {formatRupiah(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            
            {/* Rincian Biaya */}
            <div className="summary-cost">
              <div className="cost-row">
                <span>Subtotal Produk</span>
                <span>Rp {formatRupiah(subtotal)}</span>
              </div>
              <div className="cost-row">
                <span>Ongkos Kirim ({form.courier.toUpperCase()})</span>
                <span>Rp {formatRupiah(shippingCost)}</span>
              </div>
            </div>
            
            <hr />
            <div className="checkout-total">
              <span>Total Bayar</span>
              <strong>Rp {formatRupiah(grandTotal)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;