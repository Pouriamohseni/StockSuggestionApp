import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL, getAuthHeader } from '../utils';

const Dropdown = () => {
    const [suggestedStocks, setSuggestedStocks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch suggested stocks
                const response = await axios.get(`${backendURL}/stocks_suggestions/`, getAuthHeader());
                setSuggestedStocks(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Suggested Stocks</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {suggestedStocks.map((suggestedStock, index) => (
                    <div key={index} style={{ flex: '0 0 30%', margin: '10px', border: '1px solid #ccc', borderRadius:'10px', padding: '10px', backgroundColor:'#FFFFFFD9', boxShadow: '2px 2px 4px 1px rgba(0, 0, 0, 0.2)' }}>
                        <h3>Stock</h3>
                        <p>Ticker: {suggestedStock.stock.ticker}</p>
                        <p>Name: {suggestedStock.stock.name}</p>
                        <p>Price: {suggestedStock.stock.price}</p>
                        <p>Week Growth: {suggestedStock.stock.week_growth}</p>
                        <p>Five Year Growth: {suggestedStock.stock.five_year_growth}</p>
                        <p>Cap Size: {suggestedStock.stock.cap_size}</p>
                        <h3>Additional Information</h3>
                        <p>Iteration: {suggestedStock.iteration}</p>
                        <p>Shares: {suggestedStock.shares}</p>
                        <p>Price Per Share: {suggestedStock.price_per_share}</p>
                        <p>Creation Time: {new Date(suggestedStock.creation_time).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;
