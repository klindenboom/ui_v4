import React, { createContext, useState, useContext, useEffect } from 'react';
import JWTContext from 'contexts/JWTContext'; // Import JWTContext to get user data
import { getAccountSettings, setAccountSettings } from 'services/api'; // Import the API functions

export const GlobalTradeDataContext = createContext();

export const GlobalTradeDataProvider = ({ children }) => {
  const { user } = useContext(JWTContext); // Access user from context
  const [recentBalance, setRecentBalance] = useState(null);
  const [tradeGroups, setTradeGroups] = useState([]);
  const [accountSettings, setAccountSettingsState] = useState(null);
  const [originalSettings, setOriginalSettings] = useState(null);

  useEffect(() => {
    const fetchAccountSettings = async () => {
      if (user) {
        const settings = await getAccountSettings(user.id);
        const accountSettings = settings[0]; // Assuming settings is an array with one element
        setAccountSettingsState(accountSettings);
        setOriginalSettings(accountSettings);
      }
    };

    fetchAccountSettings();
  }, [user]);

  const saveAccountSettings = async (settings) => {
    const response = await setAccountSettings(settings);
    setAccountSettingsState(settings);
    setOriginalSettings(settings);
    return response;
  };

  return (
    <GlobalTradeDataContext.Provider
      value={{
        recentBalance,
        setRecentBalance,
        tradeGroups,
        setTradeGroups,
        accountSettings,
        setAccountSettingsState,
        originalSettings,
        saveAccountSettings
      }}
    >
      {children}
    </GlobalTradeDataContext.Provider>
  );
};
