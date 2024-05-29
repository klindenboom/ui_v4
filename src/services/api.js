import axios from 'axios';
import * as Sentry from '@sentry/react';
import { balanceDataStub } from './stubs';

const BASE_URL = 'http://157.245.122.23';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add the Authorization header if the token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('serviceToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleApiError = (error) => {
  Sentry.captureException(error);
  console.error(error);
  // Return a standardized error response
  return { error: true, message: error.message };
};

// Accounts Endpoints
export const accountLogin = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAccountInfo = async () => {
  try {
    const response = await api.get('/accounts');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAccountBalance = async () => {
  try {
    const response = await api.get('/accounts/balance');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAccountMargin = async () => {
  try {
    const response = await api.get('/accounts/margin');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAccountSettings = async (userId) => {
  try {
    const response = await api.get(`/accounts/settings?userId=${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const setAccountSettings = async (settings) => {
  try {
    const response = await api.post(`/accounts/settings`, settings);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Trade Groups Endpoints
export const getTradeGroups = async () => {
  try {
    const response = await api.get('/trades/groups');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createTradeGroup = async (tradeGroupData) => {
  try {
    const response = await api.post('/trades/groups', tradeGroupData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteTradeGroup = async (groupId) => {
  try {
    const response = await api.delete('/trades/groups', {
      data: { groupId }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const assignTradeToGroup = async (groupId, tradeId) => {
  try {
    const response = await api.patch(`/trades/groups/assign?tradeGroupId=${groupId}&tradeId=${tradeId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const removeTradeFromGroup = async (groupId, tradeId) => {
  try {
    const response = await api.patch('/trades/groups/remove', { groupId, tradeId });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateTradeGroup = async (tradeGroupData) => {
  try {
    const response = await api.patch('/trades/groups/update', tradeGroupData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Trades Endpoints
export const getTrades = async () => {
  try {
    const response = await api.get('/trades');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTradesWithoutGroupId = async () => {
  try {
    const response = await api.get('/trades/noGroupId');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getOpenPositions = async () => {
  try {
    const response = await api.get('/trades/openPositions');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const closeTrade = async (tradeId) => {
  try {
    const response = await api.get('/trades/close', {
      params: { tradeId }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getNewTrades = async () => {
  try {
    const response = await api.get('/trades/getNewTrades');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;
