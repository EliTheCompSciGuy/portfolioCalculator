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
        <div className="form-container w-full  " style={{ marginBottom: '80px' }}>
          <form
            onSubmit={handleSubmit}>
              <div className='flex flex-none justify-center p-4 m-11 '>
                <div >
                  <label className='border border-black p-3 bg-lime-300 rounded-2xl mr-8'>
                    <span className="standard-text">Start Date:</span>
                      <input
                          type="date"
                          value={startDate}
                          className='rounded-lg text-center'
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                      />
                  </label>
                </div>
                <div>
                  <label className="p-3 border border-black bg-lime-300 rounded-2xl">
                    <span className="standard-text">Initial Balance:</span>
                      <input
                          type="number"
                          value={initialBalance}
                          className='rounded-lg text-center'
                          onChange={(e) => setInitialBalance(e.target.value)}
                          required
                      />
                  </label>
                </div>


              </div>
              <div className=' place-content-center'>
            {stockList.map((stock, index) => (
              <div className="stock-group  content-center w-screen" >
              <div key={index} className='grid grid-cols-3 justify-around content-center w-screen'>
                <div className='p-4'>
                  <label className="block-label p-3 rounded-lg bg-[rgb(44,104,163)] border border-black ">
                    <span className="standard-text">Stock Symbol:</span>
                    
                      <input
                        type="text"
                        className=' rounded-md text-center'
                        value={stock.symbol}
                        onChange={(e) =>
                          handleStockChange(index, 'symbol', e.target.value.slice(0, 5))
                        }
                        required
                      />
                      
                        <span
                          className={`text-sm 'standard-text'`}
                        >
                          {stock.symbol.length}/5
                        </span>
                      
                    
                  </label>
                </div>

                <div className='p-4'>
                  <label className="block-label p-3 rounded-lg bg-[rgb(136,211,236)] border border-black ">
                    <span className="standard-text">Allocation (%):</span>
                    <input
                      type="number"
                      className=' rounded-md text-center'
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
                  <div className='p-4 '>
                    <div >
                      <button
                        className='bg-red-500 border border-black min-w-fit rounded-lg '
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
          </div>

            <br></br>
            {/* bg-[rgb(90,210,162)] */}
            <button
              type="button" className= ' bg-emerald-500 rounded-2xl text-white border border-white-300 p-2 mr-2'
              onClick={addStock}>
              Add Stock
            </button>
            {/* bg-[rgb(232,178,70)] */}
    
            <button

              type="submit" className=' rounded-2xl bg-amber-400 border text-white border-white-300 p-2'>
              Calculate
            </button>

            {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className=' place-items-center flex justify-center'>
            {Object.keys(pastData).length > 0 && (
              <div className="mt-4 bg-orange-500 h-full place-content-center border-white border-4 text-white p-4 min-w-fit ">
                <h2 className="text-xl font-semibold mb-2 underline">Results</h2>
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
          </div>
        )}

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          </form>
        </div>
    )
}
export default InfoForm;