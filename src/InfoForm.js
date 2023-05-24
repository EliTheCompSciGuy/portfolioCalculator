import React, { useState } from 'react'

//API Key: d8db93b162fd1b628f3d86fe8e926cae
function InfoForm() {
    const [startDate, setStartDate] = useState('')
    const [initialBalance, setInitialBalance] = useState('')
    const [newBalance, setNewBalance] = useState(0)
    const [stockList, setStockList] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
      }

      return (
        <div className="form-container" style={{ marginBottom: '80px' }}>
          <form
            onSubmit={handleSubmit}>
              <div className="w-1/2">
                <label className="block">
                  <span className="text-gray-700">Start Date:</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </label>
              </div>
              <div className="w-1/2">
                <label className="block">
                  <span className="text-gray-700">Initial Balance:</span>
                    <input
                        type="number"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        required
                    />
                </label>
              </div>

            <br></br>
    
            <button
              type="submit">
              Calculate
            </button>
          </form>
        </div>
      )
}
export default InfoForm;