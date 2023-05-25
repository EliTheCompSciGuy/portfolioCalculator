import React, { useState } from 'react'
import axios from 'axios'

//API Key (Twelve Data): 311df7413107471b862f45a6a97a6304
function InfoForm() {
    const [startDate, setStartDate] = useState('')
    const [initialBalance, setInitialBalance] = useState('')
    const [stockList, setStockList] = useState([])
    const [pastData, setPastData] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        
      if (!isValidInputs()) {
        return}

      try {
        setIsLoading(true)
        await getPastData()
        setErrorMessage('')}

      catch (error) {
        setErrorMessage('Failed to fetch data. Please try again.')}
      
      finally {
      setIsLoading(false)}
    }
    
    const getPastData = async (e) => {
        const apiKey = '311df7413107471b862f45a6a97a6304'; //Twelve Data API key
        const symbols = stockList.map((stockList) => stockList.symbol);
        const endDate = new Date().toISOString().slice(0, 10);
        const symbols_format = symbols.join(',');
        const interval = '1day';

        const response = await axios.get(
            'https://api.twelvedata.com/time_series?symbol='+ symbols_format +'&interval='+ interval +'&apikey='+ apiKey,
            {
              params: {
                start_date: startDate,
                end_date: endDate,
              },
            }
          );
          const pastData = {};
      
          for (const symbol in response.data) {
            if (symbol !== 'status' && symbol !== 'meta' && symbol !== 'values') {
              const closeValues = response.data[symbol].values.map(
                (item) => parseFloat(item.close)
              );
              pastData[symbol] = closeValues;
            }
            else if(symbol === 'values')
            {
              const symb = response.data.meta.symbol;
              const closeValues = response.data.values.map((item) => parseFloat(item.close));
              pastData[symb] = closeValues;
            }
          }
          setPastData(pastData);
    }

    const isValidInputs = () => {
      if (!startDate) {
        setErrorMessage('Enter a valid start date')
        return false
      }
  
      if (isNaN(initialBalance) || initialBalance <= 0) {
        setErrorMessage('Enter a valid initial balance > 0')
        return false
      }
  
      const totalAllocation = stockList.reduce(
        (total, stock) => total + parseFloat(stock.allocation),
        0
      )
      if (totalAllocation !== 100) {
        setErrorMessage('Total allocation percentage should be 100%.')
        return false
      }
      return true
    }
  
    const handleStockChange = (index, key, value) => {
      const updatedStockList = [...stockList]
      updatedStockList[index][key] = value
      
      setStockList(updatedStockList)
    }
  
    const addStock = () => {
      setStockList([...stockList, { symbol: '', allocation: '', num: 0 }])
    }
  
    const removeStock = (index) => {
      const updatedStockList = [...stockList]
      updatedStockList.splice(index, 1)
      setStockList(updatedStockList)
    }

    const getCalculatedValue = () => {
      var total = 0
      for (const key in pastData) {
        const stockData = pastData[key];
        const boughtDate = stockData[stockData.length - 1]
        const latestDate = stockData[0]
        const allocation = stockList.find((stock) => stock.symbol === key)?.allocation;
        const stockValue = latestDate * (allocation / 100) * initialBalance / boughtDate;
  
        total += stockValue
      }
      //2 decimal places
      return total.toFixed(2);
    };

    return (
        <div className="form-container" style={{ marginBottom: '80px' }}>
          <form
            onSubmit={handleSubmit}>
              <div>
                <label className="block">
                  <span className="standard-text">Start Date:</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="standard-text">Initial Balance:</span>
                    <input
                        type="number"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        required
                    />
                </label>
              </div>

            {stockList.map((stock, index) => (
              <div className="stock-group container" style={{ marginBottom: '10px' }}>
              <div key={index}>
                <div>
                  <label className="block-label">
                    <span className="standard-text">Stock Symbol:</span>
                    <div>
                      <input
                        type="text"
                        value={stock.symbol}
                        onChange={(e) =>
                          handleStockChange(index, 'symbol', e.target.value.slice(0, 5))
                        }
                        required
                      />
                      <div>
                        <span
                          className={`text-sm 'standard-text'`}
                        >
                          {stock.symbol.length}/5
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block-label">
                    <span className="standard-text">Allocation (%):</span>
                    <input
                      type="number"
                      value={stock.allocation}
                      onChange={(e) => {
                        const value = Math.min(Number(e.target.value), 100);
                        handleStockChange(index, 'allocation', value.toString());
                      }}
                      required
                    />
                  </label>
                </div>

                {index > 0 && (
                  <div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeStock(index)}
                        style={{ paddingLeft: '5px' }} >
                      Remove Stock
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </div>
          ))}

            <br></br>
            <button
              type="button"
              onClick={addStock}>
              Add Stock
            </button>
    
            <button
              type="submit">
              Calculate
            </button>

            {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {Object.keys(pastData).length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Results</h2>
                <p>Start Date: {startDate}</p>
                <p>Initial Balance: ${initialBalance}</p>
                <p>Portfolio Allocation:</p>
                {stockList.map((stock, index) => (
                  <li key={index}>
                    {stock.symbol}: {stock.allocation}%
                  </li>
                ))}
                <p>Current Portfolio Value: ${getCalculatedValue()}</p>
              </div>
            )}
          </>
        )}

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          </form>
        </div>
    )
}
export default InfoForm;