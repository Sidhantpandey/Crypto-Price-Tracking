import React, { useContext, useState, useEffect } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import {Link} from 'react-router-dom'

const Home = () => {
  const { allCoin, currency, setCurrency } = useContext(CoinContext);
  const [displayCoin, setdisplayCoin] = useState([]);
  const [input, setinput] = useState("");

  const inputHandler = (event) => {
    setinput(event.target.value);
    if (event.target.value === "") {
      setdisplayCoin(allCoin);
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setdisplayCoin(coins);
  };

  useEffect(() => {
    console.log(allCoin);
    setdisplayCoin(allCoin);
  }, [allCoin]);

  return (
    // we will have to show in a table

    <div className="home">
      <div className="hero">
        <h1>
          Largest <br /> CryptoMarketPlace
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos in
          voluptatibus asperiores, culpa consectetur voluptas!
        </p>
        <form onSubmit={searchHandler}>
          <input
            onChange={inputHandler}
            list="coinlist"
            value={input}
            type="text"
            placeholder="Search Crypto.."
            required
          />

          <datalist id="coinlist">
            {allCoin.map((item, index) => (
              <option key={index} value={item.name} />
            ))}
          </datalist>

          <button type="submit">Search</button>
        </form>
      </div>

      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p>24H Change</p>
          <p>Market Cap</p>
        </div>
        {displayCoin.slice(0, 10).map((item, index) => (
          <Link to={`/coin/${item.id}`} className="table-layout" key={index}>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt="" />
              <p>{item.name + "-" + item.symbol}</p>
            </div>
            <p>
              {currency.symbol} {item.current_price.toLocaleString()}
            </p>
            <p
              className={item.price_change_percentage_24h      > 0 ? "green" : "red"}
            >
              {item.price_change_percentage_24h}
            </p>
            <p className="market-cap">
              {currency.symbol}
              {item.market_cap.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
