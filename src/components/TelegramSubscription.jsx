import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TelegramSubscription = () => {
    const [method, setMethod] = useState('Telegram'); // default
    const [amount, setAmount] = useState(200);
    const [payNumber, setPayNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [telegramID, setTelegramID] = useState('');
    const [cryptoType, setCryptoType] = useState('usdt');
    const [network, setNetwork] = useState('erc20');
    const [showPopup, setShowPopup] = useState(false);
    const { gameName } = useParams();
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user._id;

    const details = {
        payNumber,
        telegramID,
        phoneNumber,
        gameName
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
            setMethod('Telegram')
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
        if (method === 'Telegram') return '₹';
        return cryptoType.toUpperCase();
    };

    const renderAmountSelection = () => (
        <div className="mb-4 flex items-center flex-col w-full">
            <h2 className="text-lg font-medium flex justify-between mb-2 text-gray-200">Deposit Amount</h2>
                    <button
                        className="px-4 py-2 w-3/4 rounded-md bg-[#9C1137] font-medium text-amber-200"
                    >
                        500
                    </button>
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
        <div className="mb-4 w-full">
            <label className="block mb-2 font-semibold">
                {method === 'Telegram' ? 'UPI Transaction ID' : 'Crypto Transaction Hash'}
            </label>
            <input
                type="text"
                value={payNumber}
                onChange={(e) => setPayNumber(e.target.value)}
                className="shadow-[#9C1137] shadow-xs outline-none px-4 py-2 mb-4 rounded-md w-full"
                placeholder={method === 'Telegram' ? 'Enter UPI Transaction ID' : 'Enter Crypto Tx Hash'}
            />
            <label className="block mb-2 font-semibold">
                Phone
            </label>
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="shadow-[#9C1137] shadow-xs mb-4 outline-none px-4 py-2 rounded-md w-full"
                placeholder= "Enter Phone Number"
            />
            <label className="block mb-2 font-semibold">
                Telegram ID
            </label>
            <input
                type="text"
                value={telegramID}
                onChange={(e) => setTelegramID(e.target.value)}
                className="shadow-[#9C1137] shadow-xs mb-4 outline-none px-4 py-2 rounded-md w-full"
                placeholder= "Enter Telegram ID"
            />
        </div>
    );

    return (
        <div className='bg-[#160003] text-white py-4 px-2 flex justify-center min-h-screen'>
            <div className="flex items-center flex-col min-h-screen">
                {/* Step 2 - Select Amount */}
                {renderAmountSelection()}

                {/* Step 4 - QR Scanner */}
                {amount && renderScanner()}

                {/* Step 5 - Enter Pay Number */}
                {amount && renderPayInput()}

                {/* Final Submit */}
                {amount && payNumber && (
                    <button
                        onClick={handleSubmit}
                        className="w-full mt-4 cursor-pointer bg-gradient-to-b shadow-xs shadow-[#9C1137] from-[#9C1137] via-[#9C1137] to-black text-white py-2 rounded-md"
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
                            onClick={() => {
                                setShowPopup(false)
                                navigate('/')
                            }}
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

export default TelegramSubscription;