import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { 
  FaArrowLeft, FaBox, FaTruck, FaCheck, FaClock, FaBan, 
  FaMapMarkerAlt, FaPhone, FaPaw, FaHome, FaWarehouse, FaShoppingBag
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ============================================================
// FIX ICON LEAFLET & CUSTOM ICON MARKER
// ============================================================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const warehouseIcon = new L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color:#3b82f6;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:3px solid white;">🏭</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const destinationIcon = new L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color:#10b981;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:3px solid white;">🏠</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const packageIcon = new L.divIcon({
  className: "custom-marker",
  html: `
    <div style="position:relative;">
      <div style="position:absolute;top:-6px;left:-6px;width:48px;height:48px;background:rgba(239,68,68,0.3);border-radius:50%;animation:pulseMarker 1.5s infinite;"></div>
      <div style="background-color:#ef4444;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;box-shadow:0 3px 8px rgba(0,0,0,0.4);border:3px solid white;position:relative;z-index:1;">📦</div>
    </div>
    <style>
      @keyframes pulseMarker {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.8); opacity: 0; }
      }
    </style>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// ============================================================
// HELPER: URL GAMBAR PRODUK
// ============================================================
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  return `http://localhost:5000${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

function TrackOrder() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error("Pesanan tidak ditemukan.");
          throw new Error(`Gagal mengambil data (Status: ${response.status})`);
        }

        const data = await response.json();
        setOrder(data.data || data);
        setError("");
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat memuat pesanan.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const formatRupiah = (value) => Number(value || 0).toLocaleString("id-ID");

  const getStatusInfo = (status) => {
    const s = (status || "").toLowerCase();
    if (["pending", "menunggu"].includes(s)) return { label: "Menunggu Konfirmasi", icon: <FaClock />, color: "#f59e0b", code: 0 };
    if (["dikemas", "packed"].includes(s)) return { label: "Sedang Dikemas", icon: <FaBox />, color: "#3b82f6", code: 1 };
    if (["dikirim", "shipped"].includes(s)) return { label: "Sedang Dikirim", icon: <FaTruck />, color: "#8b5cf6", code: 2 };
    if (["selesai", "completed"].includes(s)) return { label: "Selesai", icon: <FaCheck />, color: "#10b981", code: 3 };
    if (["ditolak", "batal"].includes(s)) return { label: "Dibatalkan", icon: <FaBan />, color: "#ef4444", code: -1 };
    return { label: status || "Menunggu", icon: <FaClock />, color: "#6b7280", code: 0 };
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}><FaPaw style={{ fontSize: "3rem", color: "#3b82f6" }} /><h2>Memuat data...</h2></div>;
  if (error || !order) return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <FaBan style={{ fontSize: "3rem", color: "#ef4444" }} />
      <h2>{error || "Pesan tidak ditemukan."}</h2>
      <Link to="/cart" style={{ color: "#3b82f6" }}>Kembali</Link>
    </div>
  );

  const statusInfo = getStatusInfo(order.status);

  // ============================================================
  // PERBAIKAN: PARSING DATA ITEMS YANG LEBIH PINTAR
  // ============================================================
  let parsedItems = [];
  if (Array.isArray(order.items)) {
    parsedItems = order.items;
  } else if (typeof order.items === "string") {
    try {
      const parsed = JSON.parse(order.items);
      if (Array.isArray(parsed)) parsedItems = parsed;
    } catch (e) {
      console.error("Gagal parse items dari string:", e);
    }
  }

  // Fallback: Jika items benar-benar kosong tapi ada itemName, kita buat item dummy agar tetap tampil
  if (parsedItems.length === 0 && order.itemName) {
    parsedItems = [{
      name: order.itemName,
      quantity: order.quantity || 1,
      price: (order.total || order.price) / (order.quantity || 1),
      image: null, // Tidak ada gambar
      category: order.type || "Produk"
    }];
  }

  const items = parsedItems;

  // ============================================================
  // KOORDINAT & RUTE
  // ============================================================
  const warehouseCoord = [-6.200000, 106.816666];
  const cityCoords = {
    "jakarta": [-6.2088, 106.8456],
    "bandung": [-6.9175, 107.6191],
    "surabaya": [-7.2575, 112.7521],
    "medan": [3.5952, 98.6722],
    "semarang": [-6.9667, 110.4167],
    "yogyakarta": [-7.7956, 110.3695],
    "bali": [-8.4095, 115.1889],
    "makassar": [-5.1477, 119.4327],
    "papua": [-2.5337, 140.7181],
  };

  const cityKey = (order.city || "").toLowerCase().trim();
  const destinationCoord = cityCoords[cityKey] || [-6.9175, 107.6191];

  const getPackagePosition = (statusCode) => {
    if (statusCode <= 0) return warehouseCoord;
    if (statusCode === 3) return destinationCoord;
    if (statusCode === 2) {
      return [
        warehouseCoord[0] + (destinationCoord[0] - warehouseCoord[0]) * 0.7,
        warehouseCoord[1] + (destinationCoord[1] - warehouseCoord[1]) * 0.7,
      ];
    }
    return warehouseCoord;
  };

  const packageCoord = getPackagePosition(statusInfo.code);

  // ============================================================
  // PERBAIKAN: TEKS PETUNJUK ARAH (TERMASUK "SUDAH SAMPAI TUJUAN")
  // ============================================================
  const getDirectionText = () => {
    if (statusInfo.code === -1) return "Pesanan dibatalkan";
    if (statusInfo.code === 0) return "Paket sedang disiapkan di Gudang Jakarta";
    if (statusInfo.code === 1) return `Paket sedang dikemas untuk dikirim ke ${order.city}`;
    if (statusInfo.code === 2) return `Paket sedang dalam perjalanan menuju ${order.city} (${order.courier})`;
    if (statusInfo.code === 3) return `Paket sudah sampai tujuan (${order.city})`; // <-- Diubah sesuai permintaan
    return "Menunggu update lokasi";
  };

  const calculatedSubtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 1)), 0);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem", fontFamily: "sans-serif" }}>
      <Link to="/cart" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#3b82f6", textDecoration: "none", fontWeight: "600", marginBottom: "1.5rem" }}>
        <FaArrowLeft /> Kembali ke Pesanan Saya
      </Link>

      <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ backgroundColor: "#1e3a5f", color: "#fff", padding: "1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaTruck /> Lacak Pesanan
          </h1>
          <p style={{ margin: "0.5rem 0 0 0", opacity: 0.8 }}>ID Pesanan: #{String(order.id || order._id).slice(-8)}</p>
        </div>

        {/* Status & Kurir */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ backgroundColor: statusInfo.color, color: "#fff", padding: "10px", borderRadius: "50%", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", width: "45px", height: "45px" }}>
              {statusInfo.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>Status Pesanan</p>
              <h3 style={{ margin: 0, color: statusInfo.color }}>{statusInfo.label}</h3>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>🚚 Kurir Pilihan Anda</p>
              <strong style={{ fontSize: "1.1rem", color: "#1e293b" }}>{order.courier || "-"}</strong>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>📋 Nomor Resi</p>
              <strong style={{ fontSize: "1.1rem", color: "#1e293b" }}>{order.trackingNumber || "Menunggu input"}</strong>
            </div>
          </div>
        </div>

        {/* Peta */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e3a5f", fontSize: "1.1rem" }}>📍 Peta Pelacakan Paket</h3>
          
          <div style={{ 
            backgroundColor: "#eff6ff", 
            border: "1px solid #bfdbfe", 
            borderRadius: "8px", 
            padding: "12px", 
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <FaTruck style={{ color: "#3b82f6", fontSize: "1.5rem" }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#1e40af", fontWeight: "600" }}>
                Petunjuk Arah
              </p>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#1e293b" }}>
                {getDirectionText()}
              </p>
            </div>
          </div>

          <div style={{ height: "350px", borderRadius: "12px", overflow: "hidden", border: "2px solid #e2e8f0" }}>
            <MapContainer 
              center={[
                (warehouseCoord[0] + destinationCoord[0]) / 2,
                (warehouseCoord[1] + destinationCoord[1]) / 2
              ]} 
              zoom={7} 
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Polyline positions={[warehouseCoord, destinationCoord]} color="#3b82f6" weight={4} opacity={0.6} dashArray="10, 10" />
              <Marker position={warehouseCoord} icon={warehouseIcon}>
                <Popup><strong>🏭 Gudang PetCare Hub Zalta</strong><br />Jakarta, Indonesia</Popup>
              </Marker>
              <Marker position={destinationCoord} icon={destinationIcon}>
                <Popup><strong>🏠 Alamat Tujuan</strong><br />{order.address}, {order.city}</Popup>
              </Marker>
              <Marker position={packageCoord} icon={packageIcon}>
                <Popup><strong>📦 Posisi Paket Saat Ini</strong><br />{getDirectionText()}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* RINCIAN PESANAN */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#1e3a5f", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaShoppingBag /> Barang yang Dibeli
          </h3>
          
          {items.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {items.map((item, idx) => {
                const imgSrc = getImageUrl(item.image || item.imageUrl || item.img || item.photo || item.gambar);
                const qty = Number(item.quantity || 1);
                const price = Number(item.price || 0);
                const subtotal = qty * price;

                return (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <div style={{
                      width: "70px", height: "70px", flexShrink: 0, borderRadius: "8px",
                      overflow: "hidden", backgroundColor: "#dbeafe",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid #e2e8f0"
                    }}>
                      {imgSrc ? (
                        <img 
                          src={imgSrc} alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = "🐾"; e.target.parentNode.style.fontSize = "28px"; }}
                        />
                      ) : (
                        <span style={{ fontSize: "28px" }}>🐾</span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: "600", color: "#1e293b", fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name || "Produk"}
                      </p>
                      {item.category && (
                        <span style={{ display: "inline-block", marginTop: "2px", fontSize: "0.75rem", color: "#3b82f6", backgroundColor: "#dbeafe", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
                          {item.category}
                        </span>
                      )}
                      <p style={{ margin: "6px 0 0 0", fontSize: "0.9rem", color: "#64748b" }}>
                        {qty} barang × Rp {formatRupiah(price)}
                      </p>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>Subtotal</p>
                      <strong style={{ color: "#1e293b", fontSize: "1rem" }}>Rp {formatRupiah(subtotal)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <FaShoppingBag style={{ fontSize: "2rem", marginBottom: "0.5rem" }} />
              <p style={{ margin: 0 }}>Tidak ada rincian produk.</p>
            </div>
          )}

          {/* Ringkasan Total */}
          <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#64748b" }}>Total Barang</span>
              <span style={{ color: "#1e293b", fontWeight: "600" }}>
                {items.reduce((sum, i) => sum + Number(i.quantity || 1), 0)} item
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#64748b" }}>Subtotal Produk</span>
              <span style={{ color: "#1e293b", fontWeight: "600" }}>
                Rp {formatRupiah(calculatedSubtotal || order.subtotal || order.total)}
              </span>
            </div>
            {order.shippingCost > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748b" }}>Ongkos Kirim ({order.courier || "-"})</span>
                <span style={{ color: "#1e293b", fontWeight: "600" }}>
                  Rp {formatRupiah(order.shippingCost)}
                </span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "2px solid #e2e8f0", marginTop: "4px" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1e293b" }}>Total Bayar</span>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#3b82f6" }}>
                Rp {formatRupiah(order.total || calculatedSubtotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Alamat Pengiriman */}
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#1e3a5f", fontSize: "1.1rem" }}>Alamat Tujuan</h3>
          <p style={{ margin: 0, color: "#475569", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaMapMarkerAlt /> {order.address}, {order.city} {order.postalCode}
          </p>
          <p style={{ margin: "0.5rem 0 0 0", color: "#475569", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaPhone /> {order.phone}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;