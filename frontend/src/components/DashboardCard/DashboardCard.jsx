import "./DashboardCard.css";

function DashboardCard({ title, value }) {

    return (

        <div className="dashboard-card">

            <h4>{title}</h4>

            <h2>{value}</h2>

        </div>

    );

}

export default DashboardCard;