import { createContext, useState, useEffect } from 'react';

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$"
  });

  const fetchAllCoin = async () => {
    try {
      const options = {
        method: 'GET',
        headers: { 
          accept: 'application/json', 
          'x-cg-demo-api-key': 'CG-jDFX2chwPyE6B84qqnHUaU4Y'
        }
      };

      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`, options);
    //   if (!response.ok) {
    //     throw new Error(`Error: ${response.status} - ${response.statusText}`);
    //   }
      const data = await response.json();
      setAllCoin(data); // Update state with fetched data
    } catch (error) {
      console.error("Failed to fetch coins:", error);
    }
  };

  // Fetch coins whenever `currency` changes
  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
