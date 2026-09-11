import "./UserTable.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function UserTable() {
  const users = [
    {
      id: 1,
      nama: "Vanya",
      email: "vanya@gmail.com",
      role: "User",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Administrator",
      email: "admin@petcare.com",
      role: "Admin",
      status: "Aktif",
    },
  ];

  return (
    <div className="table-container">

      <div className="table-header">

        <h2>Data Pengguna</h2>

        <button className="add-btn">
          + Tambah User
        </button>

      </div>

      <table>

        <thead>

          <tr>

            <th>No</th>

            <th>Nama</th>

            <th>Email</th>

            <th>Role</th>

            <th>Status</th>

            <th>Aksi</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user, index) => (

            <tr key={user.id}>

              <td>{index + 1}</td>

              <td>{user.nama}</td>

              <td>{user.email}</td>

              <td>

                <span
                  className={
                    user.role === "Admin"
                      ? "role admin"
                      : "role user"
                  }
                >
                  {user.role}
                </span>

              </td>

              <td>

                <span className="status">

                  {user.status}

                </span>

              </td>

              <td>

                <button className="edit">

                  <FaEdit />

                </button>

                <button className="delete">

                  <FaTrash />

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default UserTable;