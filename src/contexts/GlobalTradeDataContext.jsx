import React, { createContext, useState } from 'react';

export const GlobalTradeDataContext = createContext();

export const GlobalTradeDataProvider = ({ children }) => {
  const [recentBalance, setRecentBalance] = useState(null);

  return (
    <GlobalTradeDataContext.Provider value={{ recentBalance, setRecentBalance }}>
      {children}
    </GlobalTradeDataContext.Provider>
  );
};
