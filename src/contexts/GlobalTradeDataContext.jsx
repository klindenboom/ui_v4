import React, { createContext, useState } from 'react';

export const GlobalTradeDataContext = createContext();

export const GlobalTradeDataProvider = ({ children }) => {
  const [recentBalance, setRecentBalance] = useState(null);
  const [tradeGroups, setTradeGroups] = useState([]);
  return (
    <GlobalTradeDataContext.Provider value={{ recentBalance, setRecentBalance, tradeGroups, setTradeGroups }}>
      {children}
    </GlobalTradeDataContext.Provider>
  );
};

