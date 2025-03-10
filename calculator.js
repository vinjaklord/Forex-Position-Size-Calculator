import axios from 'axios';

const positionSize = async (req, res, next) => {
  const {
    baseCurrency,
    comparedTo,
    accountSize,
    riskRatio,
    stopLoss,
    accountCurrency,
  } = req.body;

  console.log('Received data:', req.body); // Log incoming data to ensure it's correct

  // Check for missing parameters
  if (
    !baseCurrency ||
    !comparedTo ||
    !accountSize ||
    !riskRatio ||
    !stopLoss ||
    !accountCurrency
  ) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    const response = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`
    );

    const response2 = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${accountCurrency}.json`
    );

    const data = response.data;
    const data2 = response2.data;

    // Check if the response data is valid
    if (!data || !data2) {
      throw new Error('Invalid data received from currency API');
    }

    // Extract exchange rate from the API response
    const exchangeRate = data[baseCurrency][comparedTo];
    if (!exchangeRate) {
      throw new Error(
        `Exchange rate for ${baseCurrency} to ${comparedTo} not available.`
      );
    }

    console.log(`Ex Rate: ${exchangeRate}`);

    // Check if the second API response has the necessary data for accountCurrency
    if (!data2[accountCurrency] || !data2[accountCurrency][comparedTo]) {
      throw new Error(
        `Currency data for ${accountCurrency} to ${comparedTo} not available.`
      );
    }

    const datex = data2[accountCurrency][comparedTo];
    const first = datex * (+riskRatio * 100);
    const helper = +stopLoss;
    const helper2 = +accountSize / helper;

    // Adjust for JPY calculation if comparedTo is JPY
    const lotMultiplier = comparedTo === 'jpy' ? 100 : 1;
    const helper3 = (first * helper2) / lotMultiplier;

    const positionSize = helper3;
    const lotSize = Math.round((positionSize / 100000) * 100) / 100;

    console.log(`Position size: ${positionSize}`);

    // Return the calculated lot size
    res.json({ lotSize });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch exchange rate or perform calculation' });
  }
};

export { positionSize };
