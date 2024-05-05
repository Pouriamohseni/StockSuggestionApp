import { useState, useEffect } from 'react';
import axios from 'axios';
import './StockStatsTable.css';
import { backendURL, getAuthHeader } from '../utils';

const StockStatsTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backendURL}/stocks/`, getAuthHeader());
                const sortedData = response.data.sort((a, b) => b.week_growth - a.week_growth);
                setData(sortedData.slice(0, 5));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Fetch data every 5 seconds
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
            <div
                style={{
                    overflowX: 'auto',
                    marginTop: '10px',
                }}
            >
                <table className='top-performer-table'>
                    <thead>
                        <tr className='title-row'>
                            <th>Ticker</th>
                            <th>Stock Name</th>
                            <th>Price</th>
                            <th>Growth %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className='stock-row'>
                                <td style={{ padding: '8px' }}>{item.ticker}</td>
                                <td style={{ padding: '8px' }}>{item.name}</td>
                                <td style={{ padding: '8px' }}>{item.price}</td>
                                <td style={{ padding: '8px' }}>{item.week_growth}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockStatsTable;
