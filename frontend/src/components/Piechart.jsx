import { PieChart, Pie, Cell } from 'recharts';
import StockStatsTable from './StockStatsTable';
import { backendURL, getAuthHeader } from '../utils';
import axios from 'axios';
import './Piechart.css';
import { useEffect, useState } from 'react';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <>
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
            <text
                x={x}
                y={y + 20}
                fill="#888"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
            ></text>
        </>
    );
};

const Piechart = () => {
    // eslint-disable-next-line
    const [apiData, setApiData] = useState([]);
    const [spread, setSpread] = useState(null);

    const calcSpread = (stockList) => {
        let sStocks = 0;
        let mStocks = 0;
        let lStocks = 0;
        for (const stock of stockList) {
            if (stock.stocks.cap_size === 's') {
                sStocks += 1;
            }
            else if (stock.stocks.cap_size === 'm') {
                mStocks += 1;
            }
            else {
                lStocks += 1;
            }
        }

        sStocks = (sStocks / stockList.length) * 100;
        mStocks = (mStocks / stockList.length) * 100;
        lStocks = (lStocks / stockList.length) * 100;

        setSpread([
            { name: 'small', value: parseFloat(sStocks.toFixed(2)) },
            { name: 'medium', value: parseFloat(mStocks.toFixed(2)) },
            { name: 'large', value: parseFloat(lStocks.toFixed(2)) },
        ]);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${backendURL}/user_stocks/`, getAuthHeader());
            setApiData(response.data);

            if (response.data.length > 0) {
                calcSpread(response.data);
            }
            else {
                setSpread([
                    { name: 'small', value: 33.33 },
                    { name: 'medium', value: 33.33 },
                    { name: 'large', value: 33.33 },
                ]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div
                className="main-container"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                }}
            >
                <div className="pie-container">
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem' }}>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#FFBB28',
                                    display: 'inline-block',
                                    marginRight: '0.5rem',
                                    borderRadius: '1rem',
                                }}
                            ></div>
                        Large Cap
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#00C49F',
                                    display: 'inline-block',
                                    marginRight: '0.5rem',
                                    borderRadius: '1rem',
                                }}
                            ></div>
                        Medium Cap
                        </li>
                        <li>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#0088FE',
                                    display: 'inline-block',
                                    marginRight: '0.5rem',
                                    borderRadius: '1rem',
                                }}
                            ></div>
                        Small Cap
                        </li>
                    </ul>

                    <PieChart width={400} height={400}>
                        <Pie
                            data={spread}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </div>

                <div className="performers">
                    <h3>Top 5 performers</h3>
                    <StockStatsTable />
                </div>
            </div>
        </>
    );
};

export default Piechart;
