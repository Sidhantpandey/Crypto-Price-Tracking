import React, { useEffect, useState, useContext } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from '../../components/LineChart/LineChart'

// using useParams we can find coin id from the url
const Coin = () => {
  const { coinId } = useParams();
  const [coindata, setcoindata] = useState(null); // Start with null instead of undefined
  const [historicalData, sethistoricalData] = useState(null); // Start with null instead of undefined
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-jDFX2chwPyE6B84qqnHUaU4Y",
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        options
      );
      const data = await response.json();
      setcoindata(data); // Update state with the response
    } catch (err) {
      console.error(err);
    }
  };

  const fetchhistoricalData=async()=>{
    const options = {
      method: 'GET',
      headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-jDFX2chwPyE6B84qqnHUaU4Y'}
    };
    
    await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`, options)
      .then(res => res.json())
      .then(res => sethistoricalData(res))
      .catch(err => console.error(err));
  }
  useEffect(() => {
    fetchCoinData(); // Refetch data when `currency` changes
    fetchhistoricalData();
  }, [currency]);

  if (coindata&&historicalData) {
    return (
      <div className="coin">
        <div className="coin-name">
          <img src={coindata.image.large} alt={coindata.name} />
          <p><b>
            {coindata.name}({coindata.symbol.toUpperCase()})
          </b></p>
          
        </div>
        <div className="coin-chart">
          <LineChart historicalData={historicalData}/> 
           {/* passing historical data thorugh props in this file  */}
        </div>
        <div className="coin-info">
          <ul>
            <li>Crypto Market Rank</li>
            <li>{coindata.market_cap_rank}</li>
          </ul>
          <ul>
            <li>Current Price</li>
            <li>{currency.symbol}{coindata.market_data.current_price[currency.name].toLocaleString()}</li>
          </ul>
          <ul>
            <li>Market Cap</li>
            <li>{currency.symbol}{coindata.market_data.market_cap[currency.name].toLocaleString()}</li>
          </ul>
          <ul>
            <li>24h High</li>
            <li>{currency.symbol}{coindata.market_data.high_24h[currency.name].toLocaleString()}</li>
          </ul>
          <ul>
            <li>24h Low</li>
            <li>{currency.symbol}{coindata.market_data.low_24h[currency.name].toLocaleString()}</li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }
};

export default Coin;
