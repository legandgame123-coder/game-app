import { useBalance } from '../context/BalanceContext';

const BalanceButton = () => {
    const {balance} = useBalance()
    const integerBalance = Math.floor(parseInt(balance, 10));

    return (
        <div className='w-24 px-3 min-w-36 py-2 bg-[#2f4553] rounded text-gray-200 font-medium shadow-sm shadow-gray-700'>{`${integerBalance}`}</div>
    )
}

export default BalanceButton