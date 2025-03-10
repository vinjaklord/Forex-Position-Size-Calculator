# Forex Position Size Calculator

## Overview

I wanted to build an app that calculates the forex position size, but I couldn't find the logic implemented in code online. So, I created this backend controller to calculate position size based on various factors such as account size, risk ratio, stop loss, and currency pairs.

## How It Works

The backend controller receives input from the client, performs several checks, and calculates the position size based on the following parameters:

1. **baseCurrency**: The currency being traded.
2. **comparedTo**: The currency that the baseCurrency is being compared to.
3. **accountSize**: The total amount available in the account.
4. **riskRatio**: The risk percentage you are willing to take per trade.
5. **stopLoss**: The distance from the entry point to the stop-loss level.
6. **accountCurrency**: The currency of the account balance.

The controller fetches real-time exchange rates using an API and performs the following steps:

1. It checks if all required parameters are provided.
2. It fetches exchange rate data for both the **baseCurrency** to **comparedTo** and the **accountCurrency** to **comparedTo**.
3. It performs the position size calculation using the formula:
   - The amount of risk per trade is determined by multiplying the **riskRatio** by the **accountSize**.
   - The stop loss is factored in to calculate the amount of the currency to risk.
   - It adjusts for special cases like trading JPY (Japanese Yen), which requires a multiplier for the calculation.

## API Endpoint

The main functionality is exposed via the following endpoint:

- **POST /position-size**

### Request Body

The request must include the following JSON parameters:

```json
{
  "baseCurrency": "USD",
  "comparedTo": "EUR",
  "accountSize": 10000,
  "riskRatio": 0.02,
  "stopLoss": 50,
  "accountCurrency": "USD"
}
