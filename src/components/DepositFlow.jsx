import axios from 'axios';
import React, { useState } from 'react';

const DepositFlow = () => {
    const [method, setMethod] = useState('UPI'); // default
    const [amount, setAmount] = useState('');
    const [payNumber, setPayNumber] = useState('');
    const [cryptoType, setCryptoType] = useState('usdt');
    const [network, setNetwork] = useState('erc20');
    const [showPopup, setShowPopup] = useState(false);


    const quickAmounts = [100, 500, 1000, 5000];

    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user._id;

    const details = {
        payNumber,
        ...(method !== 'UPI' && { network, cryptoType })
    };

    const handleSubmit = async (e) => {
        console.log("inside submit")
        e.preventDefault();
        try {
            // Replace this with your actual API endpoint
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/wallet/deposit`, {
                userId,
                amount,
                method,
                details,
                remarks: "Payment request for INR"
            });
            setShowPopup(true); // show popup

            // Reset all states
            setMethod('UPI');
            setAmount('');
            setPayNumber('');
            setCryptoType('usdt');
            setNetwork('erc20');
        } catch (error) {
            console.error('Error submitting withdrawal:', error);
            // Optionally show error feedback
        }
    };

    // Get currency symbol dynamically
    const getCurrencySymbol = () => {
        if (method === 'UPI') return '₹';
        return cryptoType.toUpperCase();
    };

    const renderAmountSelection = () => (
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Select Amount ({getCurrencySymbol()})</h2>
            <div className="flex flex-wrap gap-3 mb-3">
                {quickAmounts.map((amt) => (
                    <button
                        key={amt}
                        onClick={() => setAmount(amt)}
                        className={`px-4 py-2 border rounded-md ${amount === amt ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
                    >
                        {getCurrencySymbol()} {amt}
                    </button>
                ))}
            </div>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount in ${getCurrencySymbol()}`}
                className="border px-4 py-2 rounded-md w-full"
            />
        </div>
    );

    const renderCryptoOptions = () => (
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Select Crypto Type</h2>
            <div className="flex gap-3 mb-2">
                {['usdt', 'btc'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setCryptoType(type)}
                        className={`px-4 py-2 border rounded-md ${cryptoType === type ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
                    >
                        {type.toUpperCase()}
                    </button>
                ))}
            </div>
            <h2 className="text-lg font-semibold mb-2">Select Network</h2>
            <div className="flex gap-3">
                {['erc20', 'trc20'].map((net) => (
                    <button
                        key={net}
                        onClick={() => setNetwork(net)}
                        className={`px-4 py-2 border rounded-md ${network === net ? 'bg-purple-600 text-white' : 'bg-white text-black'}`}
                    >
                        {net.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderScanner = () => (
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Scan to Deposit</h2>
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-md">
                <span>QR Scanner</span>
            </div>
        </div>
    );

    const renderPayInput = () => (
        <div className="mb-4">
            <label className="block mb-2 font-semibold">
                {method === 'UPI' ? 'UPI Transaction ID' : 'Crypto Transaction Hash'}
            </label>
            <input
                type="text"
                value={payNumber}
                onChange={(e) => setPayNumber(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
                placeholder={method === 'UPI' ? 'Enter UPI Transaction ID' : 'Enter Crypto Tx Hash'}
            />
        </div>
    );

    return (
        <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-black py-4 px-2 flex items-center min-h-screen'>
            <div className="max-w-md mx-auto p-6 text-white bg-transparent rounded-md shadow-lg shadow-gray-600 min-h-screen">
                {/* Step 1 - Select Method */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Select Payment Method</h2>
                    <div className="flex gap-4">
                        {['UPI', 'Crypto'].map((m) => (
                            <button
                                key={m}
                                onClick={() => {
                                    setMethod(m);
                                    setAmount('');
                                    setPayNumber('');
                                }}
                                className={`px-4 py-2 border rounded-md ${method === m ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                            >
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2 - Select Amount */}
                {renderAmountSelection()}

                {/* Step 3 - Crypto Options */}
                {method === 'Crypto' && renderCryptoOptions()}

                {/* Step 4 - QR Scanner */}
                {amount && renderScanner()}

                {/* Step 5 - Enter Pay Number */}
                {amount && renderPayInput()}

                {/* Final Submit */}
                {amount && payNumber && (
                    <button
                        onClick={handleSubmit}
                        className="w-full mt-4 bg-green-600 text-white py-2 rounded-md"
                    >
                        Submit Deposit
                    </button>
                )}
            </div>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-white text-black rounded-md shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Deposit Submitted</h2>
                        <p>Your deposit request has been submitted successfully!</p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DepositFlow;
