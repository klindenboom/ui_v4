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
}

const tooltipLabelFormatter = (tooltipItem, data, pointLabels) => {
  const dataIndex = tooltipItem.dataIndex;
  const dataset = data.datasets[tooltipItem.datasetIndex];
  const fullData = dataset.fullData[dataIndex];
  const isCallSpread = dataset.fullData[dataIndex].legs[0].symbol.includes('C0');
  const fillPrice = getFillPriceForSpread(fullData).toFixed(2);
  return ` ${fillPrice < 0 ? '+' : '-'}${fullData.size} ${extractPriceCode(fullData.legs.find(i => i.action === 'Buy to Close' || i.action === 'Sell to Open').symbol)}${isCallSpread ? 'C' : 'P'} @ ${fillPrice}`;
};

// Calculate total P/L by Date
const calculateTotalPLByDate = () => {
  let totalPLByDate = {};

  data.forEach(entry => {
      if (!totalPLByDate[entry.Date]) {
          totalPLByDate[entry.Date] = 0;
      }
      totalPLByDate[entry.Date] += entry.Value; // assuming 'Value' is the key for P/L
  });

  return Object.keys(totalPLByDate).map(date => ({ date, totalPL: totalPLByDate[date] }));
};

  //TODO get from common file
  const extractPriceCode = (stockSymbol) => {
    // The regex looks for 'P' or 'C', optionally followed by '0', and then captures 4 digits.
    const regex = /[PC]0?(\d{4,})/; // Assuming the strike price is always at least 4 digits.
    const match = stockSymbol.match(regex);
    if (match) return match[1]; // Returns the captured group of digits.
    else return stockSymbol; // Returns the original symbol if no match is found.
  }

  const extractDate = (stockSymbol) => {
    // The regex looks for 'P0' or 'C0' followed by 4 digits.
    // Assuming 'P' or 'C' always follows the date
    //./GCM4 OGK4  240425P1860
    const pIndex = stockSymbol.indexOf('P0') || stockSymbol.indexOf('P');
    const cIndex = stockSymbol.indexOf('C0') || stockSymbol.indexOf('C');
    let expirationDate;

    // Determine whether 'P' or 'C' was found and calculate the start index accordingly
    if (pIndex !== -1) {
      expirationDate = stockSymbol.substring(pIndex - 6, pIndex);
    } else if (cIndex !== -1) {
      expirationDate = stockSymbol.substring(cIndex - 6, cIndex);
    } else {//if (instrumentType === 'Future'){
      return '';
    }
    expirationDate = expirationDate.substr(2, 2) + '/' + expirationDate.substr(4, 2) + '/' + expirationDate.substr(0, 2);
    console.log("expirationDate >> ", expirationDate);
    return expirationDate;
  }

export  {
    getTimeIntervals,
    tooltipLabelFormatter,
    calculateTotalPLByDate,
    extractPriceCode,
    extractDate,
}

