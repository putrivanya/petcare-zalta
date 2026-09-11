import "./UserPage.css";

function UserPage({ children }) {
  return (
    <div className="user-page">
      {children}
    </div>
  );
}

export default UserPage;