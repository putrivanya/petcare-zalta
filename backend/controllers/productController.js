exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, badge, description } = req.body;
    
    // Ambil nama file jika ada gambar yang diunggah
    const image = req.file ? req.file.filename : null;

    const newProduct = await Product.create({
      name,
      category,
      price,
      stock,
      badge,
      description,
      image
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// POST /api/products/:id/review
app.post('/api/products/:id/review', async (req, res) => {
  try {
    const productId = req.params.id;
    const { userId, rating, comment } = req.body;

    // 1. Cari Produk berdasarkan ID
    const product = await Product.findById(productId); // Jika Mongoose
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // 2. CEK APAKAH USER SUDAH PERNAH MEMBERI ULASAN
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: 'Anda sudah pernah memberikan ulasan untuk produk ini' });
    }

    // 3. Tambahkan ulasan baru
    const newReview = {
      userId,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    product.reviews.push(newReview);

    // 4. Hitung ulang rata-rata rating produk
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Ulasan berhasil ditambahkan', product });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan ulasan', error: error.message });
  }
});