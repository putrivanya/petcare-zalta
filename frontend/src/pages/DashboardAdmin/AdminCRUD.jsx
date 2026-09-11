import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import './AdminCRUD.css';

const AdminCRUD = ({ title, storageKey, columns, formFields }) => {
  // Hanya membaca data dari localStorage, default kosong []
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, storageKey]);

  const resetForm = () => {
    setFormData({});
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleOpenAdd = () => {
    const emptyForm = {};
    formFields.forEach((field) => {
      emptyForm[field.name] = '';
    });
    setFormData(emptyForm);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      setData(data.map((item) => (item.id === editId ? { ...formData, id: editId } : item)));
    } else {
      const newItem = { ...formData, id: Date.now() };
      setData([newItem, ...data]);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data ${title} ini?`)) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Kelola Data {title}</h2>
        <div className="crud-actions">
          <div className="crud-search">
            <Search size={16} />
            <input
              type="text"
              placeholder={`Cari ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={handleOpenAdd}>
            <Plus size={18} /> Tambah {title}
          </button>
        </div>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>No</th>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key}>{item[col.key] || '-'}</td>
                  ))}
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleOpenEdit(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  style={{ textAlign: 'center', padding: '30px', color: '#666' }}
                >
                  Belum ada data user terdaftar. User yang login/register akan otomatis muncul di sini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editId ? `Edit ${title}` : `Tambah ${title}`}</h3>
              <button className="btn-close" onClick={resetForm}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {formFields.map((field) => (
                <div className="form-group" key={field.name}>
                  <label>{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      required
                    >
                      <option value="">-- Pilih {field.label} --</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder || ''}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      required
                    />
                  )}
                </div>
              ))}
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCRUD;