import { useEffect, useState } from "react";

// ======================================================
// GANTI SESUAI BASE URL API KAMU
// ======================================================
const API_BASE = "http://localhost:5000/api";

// ======================================================
// KOMPONEN BINTANG (RATING)
// ======================================================
function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            cursor: "pointer",
            fontSize: 28,
            color: star <= value ? "#f5a623" : "#ccc",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ======================================================
// KOMPONEN UTAMA
// transactionId dikirim dari halaman riwayat transaksi/pesanan,
// biasanya pas transaksi.status === "selesai" && !transaksi.isReviewed
// ======================================================
export default function ReviewForm({ transactionId, userName, onSuccess }) {
  const [loadingEligibility, setLoadingEligibility] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [reviewType, setReviewType] = useState("product"); // "product" | "store"

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ====================================================
  // CEK KELAYAKAN REVIEW SAAT KOMPONEN DIBUKA
  // ====================================================
  useEffect(() => {
    async function checkEligibility() {
      try {
        setLoadingEligibility(true);

        const res = await fetch(
          `${API_BASE}/reviews/eligibility/${transactionId}`
        );
        const data = await res.json();

        if (!data.success || !data.canReview) {
          setCanReview(false);
        } else {
          setCanReview(true);
          setReviewType(data.type); // "product" atau "store"
        }
      } catch (err) {
        console.error("GAGAL CEK ELIGIBILITY:", err);
        setError("Gagal memeriksa status review, coba lagi nanti.");
      } finally {
        setLoadingEligibility(false);
      }
    }

    if (transactionId) {
      checkEligibility();
    }
  }, [transactionId]);

  // ====================================================
  // SUBMIT REVIEW
  // ====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Pilih rating dulu, minimal 1 bintang.");
      return;
    }

    if (reviewType === "product" && !comment.trim()) {
      setError("Komentar wajib diisi untuk review pertama kamu.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          userName,
          rating,
          // Kalau reviewType "store", comment tetap dikirim boleh kosong,
          // backend yang otomatis mengabaikannya.
          comment: reviewType === "product" ? comment : undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Gagal mengirim review.");
        return;
      }

      setSubmitted(true);
      onSuccess && onSuccess(data);
    } catch (err) {
      console.error("GAGAL KIRIM REVIEW:", err);
      setError("Gagal mengirim review, coba lagi nanti.");
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // RENDER
  // ====================================================
  if (loadingEligibility) {
    return <p>Memeriksa status review...</p>;
  }

  if (!canReview) {
    return <p>Transaksi ini sudah direview atau belum bisa direview.</p>;
  }

  if (submitted) {
    return (
      <p>
        {reviewType === "product"
          ? "Terima kasih atas review produknya!"
          : "Terima kasih atas rating tokonya!"}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
        {reviewType === "product"
          ? "Ini pembelian pertamamu — kasih rating dan ceritakan pengalamanmu."
          : "Kamu sudah pernah review sebelumnya — kali ini cukup kasih rating toko."}
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          Rating
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {reviewType === "product" && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Ceritakan pengalamanmu
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bagaimana kualitas produk atau layanannya?"
            style={{ width: "100%" }}
          />
        </div>
      )}

      {error && (
        <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? "Mengirim..." : "Kirim review"}
      </button>
    </form>
  );
}