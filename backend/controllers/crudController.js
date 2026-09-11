// ======================================================
// GENERIC CRUD CONTROLLER
// ======================================================

const createCRUD = (Model) => {
  // ====================================================
  // GET ALL
  // ====================================================
  const getAll = async (req, res) => {
    try {
      const data = await Model.findAll({
        order: [["id", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(`GET ${Model.name} ERROR:`, error);

      return res.status(500).json({
        success: false,
        message: error.message || "Gagal mengambil data",
      });
    }
  };

  // ====================================================
  // GET BY ID
  // ====================================================
  const getById = async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Model.findByPk(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(`GET BY ID ${Model.name} ERROR:`, error);

      return res.status(500).json({
        success: false,
        message: error.message || "Gagal mengambil data",
      });
    }
  };

  // ====================================================
  // CREATE
  // ====================================================
  const create = async (req, res) => {
    try {
      const payload = {
        ...req.body,
      };

      // -----------------------------------------------
      // FILE IMAGE
      // -----------------------------------------------
      if (req.file) {
        payload.image = `/uploads/${req.file.filename}`;
      }

      // -----------------------------------------------
      // HAPUS FIELD YANG TIDAK BOLEH DIINPUT
      // -----------------------------------------------
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;

      // -----------------------------------------------
      // CONVERT NUMERIC FIELDS (IF ANY)
      // -----------------------------------------------
      if (payload.price !== undefined) payload.price = Number(payload.price);
      if (payload.stock !== undefined) payload.stock = Number(payload.stock);

      // -----------------------------------------------
      // CREATE DATABASE
      // -----------------------------------------------
      const data = await Model.create(payload);

      return res.status(201).json({
        success: true,
        message: "Data berhasil ditambahkan",
        data,
      });
    } catch (error) {
      console.error(`CREATE ${Model.name} ERROR:`, error);

      let message = error.message || "Gagal menambahkan data";

      if (error.errors) {
        message = error.errors.map((item) => item.message).join(", ");
      }

      return res.status(400).json({
        success: false,
        message,
      });
    }
  };

  // ====================================================
  // UPDATE
  // ====================================================
  const update = async (req, res) => {
    try {
      const { id } = req.params;

      const item = await Model.findByPk(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan",
        });
      }

      const payload = {
        ...req.body,
      };

      // -----------------------------------------------
      // UPDATE IMAGE
      // -----------------------------------------------
      if (req.file) {
        payload.image = `/uploads/${req.file.filename}`;
      }

      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;

      if (payload.price !== undefined) payload.price = Number(payload.price);
      if (payload.stock !== undefined) payload.stock = Number(payload.stock);

      await item.update(payload);

      return res.status(200).json({
        success: true,
        message: "Data berhasil diperbarui",
        data: item,
      });
    } catch (error) {
      console.error(`UPDATE ${Model.name} ERROR:`, error);

      let message = error.message || "Gagal memperbarui data";

      if (error.errors) {
        message = error.errors.map((item) => item.message).join(", ");
      }

      return res.status(400).json({
        success: false,
        message,
      });
    }
  };

  // ====================================================
  // DELETE
  // ====================================================
  const remove = async (req, res) => {
    try {
      const { id } = req.params;

      const item = await Model.findByPk(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan",
        });
      }

      await item.destroy();

      return res.status(200).json({
        success: true,
        message: "Data berhasil dihapus",
      });
    } catch (error) {
      console.error(`DELETE ${Model.name} ERROR:`, error);

      return res.status(500).json({
        success: false,
        message: error.message || "Gagal menghapus data",
      });
    }
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
  };
};

module.exports = {
  createCRUD,
};