import React, { createContext, useState, useContext, useEffect } from 'react';
import JWTContext from 'contexts/JWTContext'; // Import JWTContext to get user data
import { getAccountSettings, setAccountSettings, getAccountBalance, getAccountMargin, getTradeGroups, getTradesWithoutGroupId } from 'services/api'; // Import the API functions

export const GlobalTradeDataContext = createContext();

// export const useGlobalTradeData = () => useContext(GlobalTradeDataContext);

export const GlobalTradeDataProvider = ({ children }) => {
  const { user } = useContext(JWTContext); // Access user from context
  const [recentBalance, setRecentBalance] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [accountMargin, setAccountMargin] = useState(null);
  const [tradeGroups, setTradeGroups] = useState(null);
  const [tradesWithoutGroupId, setTradesWithoutGroupId] = useState(null);
  const [accountSettings, setAccountSettingsState] = useState(null);
  const [originalSettings, setOriginalSettings] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAccountData = async () => {
      if (user) {
        try {
          const [balance, margin, settings, groups, trades] = await Promise.all([
            getAccountBalance(),
            getAccountMargin(),
            getAccountSettings(user.id),
            getTradeGroups(),
            getTradesWithoutGroupId(),
          ]);
          setAccountSettingsState(settings[0]);
          setOriginalSettings(settings[0]);
          setRecentBalance(balance[0]);
          setAccountBalance(balance);
          setAccountMargin(margin);
          setTradeGroups(groups);
          setTradesWithoutGroupId(trades);
          setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
          console.error("Error fetching account settings", error);
          setLoading(false); // Set loading to false even if there's an error
        }
      } else {
        setLoading(false); // Set loading to false if there's no user
      }
    };

    fetchAccountData();
  }, [user]);

  const saveAccountSettings = async (settings) => {
    try {
      const response = await setAccountSettings(settings);
      setAccountSettingsState(settings);
      setOriginalSettings(settings);
      return response;
    } catch (error) {
      console.error("Error saving account settings", error);
    }
  };

  return (
    <GlobalTradeDataContext.Provider
      value={{
        recentBalance,
        setRecentBalance,
        accountMargin,
        setAccountMargin,
        accountBalance,
        setAccountBalance,
        tradeGroups,
        setTradeGroups,
        tradesWithoutGroupId,
        setTradesWithoutGroupId,
        accountSettings,
        setAccountSettingsState,
        originalSettings,
        saveAccountSettings,
        loading // Include loading in the context
      }}
    >
      {!loading ? children : <div>Loading...</div>} {/* Conditionally render children */}
    </GlobalTradeDataContext.Provider>
  );
};
