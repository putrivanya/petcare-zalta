import "./Topbar.css";

function Topbar() {
  return (
    <div className="topbar">

      <div>
        <h2>Halo, Vanya 👋</h2>
        <p>Selamat datang kembali di PetCare.</p>
      </div>

      <div className="topbar-profile">

        <button className="notification">
          🔔
        </button>

        <div className="avatar">
          V
        </div>

      </div>

    </div>
  );
}

export default Topbar;