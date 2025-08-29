import React, { useState } from 'react'
import TransactionHistory from '../components/admin/TransactionHistory'
import AdminTabs from '../components/admin/AdminTabs'
import Games from '../components/admin/Games'
import Withdrawals from '../components/admin/Withdrawals'
import AdminController from '../components/admin/AdminController'
import GameRoundsTable from '../components/admin/GameRoundsTable'
import Deposite from '../components/admin/Deposite'
import AllUsers from '../components/admin/AllUsers'
import Telegram from '../components/admin/Telegram'

const Admin = () => {
  const [selectField, setSelectField] = useState('transaction')
  const user = JSON.parse(localStorage.getItem("user"))

  if (user.role == "admin") {
    return (
      <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex flex-col items-center'>
        <AdminTabs selected={selectField} onSelect={setSelectField} />
        <div className=''>
          {selectField === 'transaction' && <AllUsers />}
          {selectField === 'deposite' && <Deposite />}
          {selectField === 'games' && <Games />}
          {selectField === 'withdraw-requests' && <Withdrawals />}
          {selectField === 'admin-management' && <AdminController />}
          {selectField === 'telegram' && <Telegram />}
        </div>
      </div>
    )
  } 
  window.location.href = "/"
}

export default Admin