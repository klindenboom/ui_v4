// src/services/api.js

import axios from 'axios';
import * as Sentry from '@sentry/react';

const BASE_URL = 'http://157.245.122.23';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleApiError = (error) => {
  Sentry.captureException(error);
  console.error(error);
  // Return a standardized error response
  return { error: true, message: error.message };
};

// Accounts Endpoints
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

// Trade Groups Endpoints
export const getTradeGroups = async () => {
  try {
    const response = await api.get('/trades/groups');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Data structure for creating a new trade group:
 * {
 *   name: "string", // required
 *   description: "string", // optional
 *   status: "active" | "inactive" // optional
 * }
 */
export const createTradeGroup = async (tradeGroupData) => {
  try {
    const response = await api.post('/trades/groups', tradeGroupData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Data structure for deleting a trade group:
 * {
 *   groupId: "string" // required
 * }
 */
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

/**
 * Data structure for assigning a trade group to trade history:
 * {
 *   groupId: "string", // required
 *   tradeId: "string" // required
 * }
 */
export const assignTradeToGroup = async (groupId, tradeId) => {
  try {
    // {{ipAddress}}:{{port}}/trades/groups/assign?tradeGroupId=664bb8ed06d8e800129b8edd&tradeId=664bd8c1167e2800126f51b0
    const response = await api.patch(`/trades/groups/assign?tradeGroupId=${groupId}&tradeId=${tradeId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Data structure for removing a trade group from trade history:
 * {
 *   groupId: "string", // required
 *   tradeId: "string" // required
 * }
 */
export const removeTradeFromGroup = async (groupId, tradeId) => {
  try {
    const response = await api.patch('/trades/groups/remove', { groupId, tradeId });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Data structure for updating a trade group:
 * {
 *   name: "string", // required
 *   description: "string", // optional
 *   status: "active" | "inactive" // optional
 * }
 */
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

/**
 * Close a trade by tradeId
 * @param {string} tradeId - ID of the trade to close
 */
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
