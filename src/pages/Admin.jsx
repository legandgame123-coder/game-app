import React, { useState, useEffect } from "react";
import TransactionHistory from "../components/admin/TransactionHistory";
import AdminTabs from "../components/admin/AdminTabs";
import Games from "../components/admin/Games";
import Withdrawals from "../components/admin/Withdrawals";
import AdminController from "../components/admin/AdminController";
import GameRoundsTable from "../components/admin/GameRoundsTable";
import Deposite from "../components/admin/Deposite";
import AllUsers from "../components/admin/AllUsers";
import Telegram from "../components/admin/Telegram";
import QRCode from "../components/admin/QRCode";
import AddSpinnerPrizes from "../components/admin/AddSpinnerPrices";
import QRCodeCrypto from "../components/admin/QRCodeCrypto";
import ReferAmount from "../components/admin/ReferAmount";

const Admin = () => {
  const [selectField, setSelectField] = useState("transaction");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.location.href = "/";
    }
  }, [user]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex flex-col items-center">
      <AdminTabs selected={selectField} onSelect={setSelectField} />
      <div className="">
        {selectField === "transaction" && <TransactionHistory />}
        {selectField === "deposite" && <Deposite />}
        {selectField === "games" && <Games />}
        {selectField === "withdraw-requests" && <Withdrawals />}
        {selectField === "admin-management" && <AdminController />}
        {selectField === "telegram" && <Telegram />}
        {selectField === "spinner-prices" && <AddSpinnerPrizes />}
        {selectField === "qr-code" && <QRCode />}
        {selectField === "crypto-qr-code" && <QRCodeCrypto />}
        {selectField === "refer-amount" && <ReferAmount />}
      </div>
    </div>
  );
};

export default Admin;
