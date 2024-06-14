import dayjs from 'dayjs';

const getTimeIntervals = () => {
  const startHour = 9;
  const startMinutes = 30;
  const incrementMinutes = 15;
  const format = 'h:mm A';

  let currentDateTime = dayjs().set('hour', startHour).set('minute', startMinutes);
  const endDateTime = dayjs().set('hour', 16).set('minute', 0);

  const timeIntervals = [];

  while (currentDateTime.isBefore(endDateTime) || currentDateTime.isSame(endDateTime)) {
    timeIntervals.push({ Time: `${currentDateTime.format(format)} EST` });
    currentDateTime = currentDateTime.add(incrementMinutes, 'minute');
  }

  return timeIntervals;
};

const tooltipLabelFormatter = (tooltipItem, data, pointLabels) => {
  const dataIndex = tooltipItem.dataIndex;
  const dataset = data.datasets[tooltipItem.datasetIndex];
  const fullData = dataset.fullData[dataIndex];
  const isCallSpread = dataset.fullData[dataIndex].legs[0].symbol.includes('C0');
  const fillPrice = getFillPriceForSpread(fullData).toFixed(2);
  return ` ${fillPrice < 0 ? '+' : '-'}${fullData.size} ${extractPriceCode(fullData.legs.find(i => i.action === 'Buy to Close' || i.action === 'Sell to Open').symbol)}${isCallSpread ? 'C' : 'P'} @ ${fillPrice}`;
};

// Calculate total P/L by Date
const calculateTotalPLByDate = (data) => {
  let totalPLByDate = {};

  data.forEach(entry => {
    if (!totalPLByDate[entry.Date]) {
      totalPLByDate[entry.Date] = 0;
    }
    totalPLByDate[entry.Date] += entry.Value; // assuming 'Value' is the key for P/L
  });

  return Object.keys(totalPLByDate).map(date => ({ date, totalPL: totalPLByDate[date] }));
};

const extractPriceCode = (stockSymbol) => {
  const regex = /[PC]0?(\d{4,})/;
  const match = stockSymbol.match(regex);
  if (match) return match[1];
  else return stockSymbol;
};

const extractDate = (stockSymbol) => {
  const pIndex = stockSymbol.indexOf('P0') || stockSymbol.indexOf('P');
  const cIndex = stockSymbol.indexOf('C0') || stockSymbol.indexOf('C');
  let expirationDate;

  if (pIndex !== -1) {
    expirationDate = stockSymbol.substring(pIndex - 6, pIndex);
  } else if (cIndex !== -1) {
    expirationDate = stockSymbol.substring(cIndex - 6, cIndex);
  } else {
    return '';
  }
  expirationDate = expirationDate.substr(2, 2) + '/' + expirationDate.substr(4, 2) + '/' + expirationDate.substr(0, 2);
  console.log("expirationDate >> ", expirationDate);
  return expirationDate;
};

const calculateTotalPrice = (group) => {
  debugger;
  if (!group.tradeHistory || group.tradeHistory.length === 0) {
    return 0;
  }
  let isEquityOption = false;
  const totalValue = group.tradeHistory.reduce((total, trade) => {
    if (!trade.uiData || !trade.uiData.legs) {
      return total;
    }
    if (trade.uiData.underlyingType === 'Equity'  && !!trade.uiData.legs[0].strikeType) {
      isEquityOption = true;
    }
    return total + trade.uiData.legs.reduce((legTotal, leg) => {
      if (!leg.fills) {
        return legTotal;
      }

      return legTotal + leg.fills.reduce((fillTotal, fill) => {
        const price = parseFloat(fill.price);
        const adjustedPrice = leg.action === 'sellToOpen' || leg.action === 'sellToClose' ? price : -price;
        return fillTotal + (fill.fillCount * adjustedPrice);
      }, 0);
    }, 0);
  }, 0).toFixed(2);
  if (isEquityOption) {
    return (totalValue * 100);
  }
  return (totalValue)
};

const extractExpirationDate = (symbol) => {
  const regex = /\d{6}/;
  const match = symbol.match(regex);
  if (match) {
    const dateStr = match[0];
    const year = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const day = dateStr.substring(4, 6);
    return `20${year}-${month}-${day}`;
  }
  return null;
};

const parseTradeData = (trade) => {
  if (!trade || !trade.uiData || !trade.uiData.legs) {
    console.log("Invalid trade data");
    return [];
  }

  const data = trade.uiData;
  const tradeStrings = [];

  data.legs.forEach(leg => {
    let actionString = '';
    let actionLabel = '';
    if (leg.action === 'buyToOpen' || leg.action === 'buyToClose') {
      actionString = `+`;
      actionLabel = leg.action === 'buyToOpen' ? 'BTO' : 'BTC';
    } else if (leg.action === 'sellToOpen' || leg.action === 'sellToClose' || leg.action === 'sell' || leg.action === 'buy') {
      actionString = `-`;
      actionLabel = leg.action === 'sellToOpen' ? 'STO' : leg.action === 'sellToClose' ? 'STC' : leg.action === 'sell' ? 'STO' : 'BTC';
    } else {
      console.log("unidentified trade type");
      return;
    }

    const combinedString = `${actionString}${leg.legCount}`;
    const legStrings = [combinedString, actionLabel];

    if (leg.strikeType) {
      const expiration = leg.expiration;
      let strikePrice = leg.strikePrice;

      if (data.underlyingType === "Equity") {
        // Remove exactly three trailing zeros
        strikePrice = strikePrice.endsWith('000') ? strikePrice.slice(0, -3) : strikePrice;
      }

      const strikeType = leg.strikeType;
      legStrings.push(expiration);
      legStrings.push(strikePrice);
      legStrings.push(strikeType);
    }

    tradeStrings.push(legStrings);
  });

  return tradeStrings;
};



export {
  getTimeIntervals,
  tooltipLabelFormatter,
  calculateTotalPLByDate,
  extractPriceCode,
  extractDate,
  calculateTotalPrice,
  parseTradeData,
};
