import './StockGen.css';
import { YourStockItem, OtherStockItem } from '../components/StockGen/YourStockItem';
import { useState } from 'react';
import axios from 'axios';
import { backendURL, getAuthHeader } from '../utils';
import { toast } from 'react-toastify';

const StockGen = () => {
    const [otherStocks, setOtherStocks] = useState([]);
    const [userStocks, setUserStocks] = useState([]);
    const [userPort, setUserPort] = useState({
        small_cap_percentage: '',
        medium_cap_percentage: '',
        large_cap_percentage: ''
    });
    const [buyPower, setBuyPower] = useState('');
    const [cash, setCash] = useState('');
    const [showSug, setShowSug] = useState(false);
    const [suggestion, setSuggestion] = useState([]);
    const auth = getAuthHeader();

    const getOtherStocks = async () => {
        try {
            const resp = await axios.get(`${backendURL}/stocks/`);
            setOtherStocks(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getUserStocks = async () => {
        try {
            const resp = await axios.get(`${backendURL}/user_stocks/`, auth);
            setUserStocks(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getUserPort = async () => {
        try {
            const resp = await axios.get(`${backendURL}/user_portfolio/`, auth);
            setUserPort(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getCash = async () => {
        try {
            const resp = await axios.get(`${backendURL}/user_cash_balance/`, auth);
            setCash(resp.data.current_cash_balance);
        } catch (err) {
            console.error(err);
        }
    };

    const getSuggestion = async (e) => {
        e.preventDefault();

        if (!buyPower || parseFloat(buyPower) <= 0) {
            toast.error('please enter buy power greater than 0');
            return;
        }

        try {
            const resp = await axios.post(`${backendURL}/stocks_suggestions/`, {
                cap_size_portfolio: JSON.stringify({
                    large_cap: userPort.large_cap_percentage ?? 0,
                    medium_cap: userPort.medium_cap_percentage ?? 0,
                    small_cap: userPort.small_cap_percentage ?? 0,
                }),
                buying_power: parseFloat(buyPower),
            }, auth);

            if (resp.status === 200) {
                setSuggestion(resp.data);
                setShowSug(true);
            }
            else if (resp.status === 204) {
                toast.info('No suggestion for your portfolio right now');
            }
        } catch (err) {
            toast.error('Check if you exceeded your available balance');
            console.error(err);
        }
    };

    const deleteStock = async (id, idx) => {
        try {
            await axios.delete(`${backendURL}/user_stocks/?stocks_id=${id}`, auth);
            const temp = userStocks;
            temp.splice(idx, 1);
            setUserStocks([...temp]);
            toast.success(`Removed ${otherStocks[idx].ticker} from your list`);
        } catch (err) {
            console.error(err);
        }
    };

    const addStock = async (id, idx) => {
        try {
            await axios.post(`${backendURL}/user_stocks/`, {
                stocks_id: id,
            }, auth);
            const newItem = {
                stocks: otherStocks[idx],
                shares: 0,
            };
            setUserStocks(prev => [newItem, ...prev]);
            toast.success(`Added ${otherStocks[idx].ticker} to your list`);
        } catch (err) {
            console.error(err);
        }
    };

    const addSugToPort = async () => {
        await axios.put(`${backendURL}/user_select_suggestion/`,
            { stocks_list: suggestion },
            auth
        );

        setShowSug(false);
        getUserStocks();
        getCash();
    };

    const inputCashChange = (e) => {
        const val = e.target.value;
        setCash(val);
    };

    const inputPercentChange = (e) => {
        const val = e.target.value;
        const name = e.target.name;

        setUserPort(prev => {
            return { ...prev, [name]: val };
        });
    };

    const updatePortfolio = async (e) => {
        e.preventDefault();
        const sum = parseFloat(userPort.large_cap_percentage) + parseFloat(userPort.medium_cap_percentage) + parseFloat(userPort.small_cap_percentage);

        if (Math.ceil(sum) > 100 || Math.ceil(sum) < 100) {
            toast.error('The total of you portfolio must be 100%');
            return;
        }

        axios.patch(
            `${backendURL}/user_portfolio/`,
            userPort,
            getAuthHeader()
        );

        axios.put(
            `${backendURL}/user_cash_balance/`,
            { current_cash_balance: cash },
            getAuthHeader()
        );

        toast.success('yay');
    };

    useState(() => {
        getOtherStocks();
        getUserStocks();
        setInterval(
            function() {
                getOtherStocks();
                getUserStocks();
            }, 10 * 1000
        );
        getUserPort();
        getCash();
    }, []);

    return (
        <div className="stockgen-body">
            {showSug &&
                <div
                    className='sug-modal'
                    onClick={() => setShowSug(false)}
                >
                    <div onClick={(e) => {e.stopPropagation();}}>
                        <div className='sug-header'>
                            <h3>Your stock purchase suggestion</h3>
                            <button onClick={addSugToPort}>Add to your portfolio</button>
                        </div>
                        <div className='sug-side-container'>
                            <div className='sug-item sug-item-header'>
                                <h4>Stock</h4>
                                <h4>Price per share</h4>
                                <h4>Shares</h4>
                            </div>
                            {suggestion.map((item, idx) => {
                                return (
                                    <div key={`sug-${idx}`} className='sug-item'>
                                        <p><strong>{item.ticker}</strong></p>
                                        <p>${item.price}</p>
                                        <p>{item.buy}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            }

            <div className="class-name">
                <h3>Other stocks</h3>
                <h3>Your stocks</h3>
                <h3>Your portfolio</h3>
            </div>

            <div className="stockgen-container">
                <div>
                    {otherStocks.map((item, idx) => {
                        return (
                            <OtherStockItem item={item} key={idx} addStock={() => addStock(item.id, idx)}/>
                        );
                    })}
                </div>
                <div>
                    {userStocks.map((item, idx) => {
                        return (
                            <YourStockItem item={item} key={idx} deleteStock={() => deleteStock(item.stocks.id, idx)}/>
                        );
                    })}
                </div>
                <div className='user-port-area'>
                    <div className='port-cash-section'>
                        {userPort &&
                            <div className='portfolio-side'>
                                <div className='portfolio-field'>
                                    <p>Small</p>
                                    <input
                                        type='number'
                                        value={userPort.small_cap_percentage}
                                        name='small_cap_percentage'
                                        onChange={inputPercentChange}
                                    />
                                    <p>%</p>
                                </div>
                                <div className='portfolio-field'>
                                    <p>Medium</p>
                                    <input
                                        type='number'
                                        value={userPort.medium_cap_percentage}
                                        name='medium_cap_percentage'
                                        onChange={inputPercentChange}
                                    />
                                    <p>%</p>
                                </div>
                                <div className='portfolio-field'>
                                    <p>Large</p>
                                    <input
                                        type='number'
                                        value={userPort.large_cap_percentage}
                                        name='large_cap_percentage'
                                        onChange={inputPercentChange}
                                    />
                                    <p>%</p>
                                </div>
                            </div>
                        }
                        <div className='cash-side'>
                            <p>Available cash</p>
                            <h3>
                                <input
                                    type='number'
                                    value={cash && cash}
                                    onChange={inputCashChange}
                                />
                                $
                            </h3>
                        </div>
                    </div>
                    <button onClick={updatePortfolio}>
                        Update portfolio
                    </button>
                    <input
                        className="inputField"
                        type="numeric"
                        placeholder="Buying power"
                        name="buying-power"
                        value={buyPower}
                        onChange={(e) => {
                            setBuyPower(e.target.value);
                        }}
                        required
                    />
                    <button onClick={getSuggestion}>
                        Generate suggestion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockGen;