import './Home.css';
import Piechart from '../components/Piechart';
import Dropdown from '../components/Dropdown';

function Dashboard() {
    return (
        <div className="dashboard-page">
            <Piechart />
            <br />

            <Dropdown/>
        </div>
    );
}

export default Dashboard;
