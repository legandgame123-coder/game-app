import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import BalanceButton from './BalanceButton';
import { Wallet, X } from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth();
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/visible-games`)
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setGames(data.data);
        }
      });
  }, []);

  const gameInfo = {
    chicken: {
      displayName: "Chicken Escape",
      image: "/header.png",
      link: "/chicken-road"
    },
    mining: {
      displayName: "Gold Miner Quest",
      image: "/header.png",
      link: "mines"
    },
    aviator: {
      displayName: "Aviator",
      image: "/header.png",
      link: "mines"
    },
    color: {
      displayName: "Color Trading",
      image: "/header.png",
      link: "mines"
    }
  };

  return (
    <nav className="bg-transparent w-full py-3 ">
      <div className='text-white flex justify-between items-center px-6 md:px-20'>
        <div>LOGO</div>
        {isAuthenticated ? <div className='flex items-center gap-4'>
          <BalanceButton />
          <div className='p-2 bg-yellow-300 rounded block md:hidden' onClick={() => setOpen(!open)}><Wallet size={24} color="black" /></div>
          <div className='md:flex hidden gap-4'>
            <Link to={"/deposite"}><Button children="Deposite" className='bg-blue-500 hover:bg-blue-600' /></Link>
            <Link to={"/withdraw"} ><Button children="Withdraw" /></Link>
          </div>
        </div> : ''}
        <div className='flex gap-4'>
          {isAuthenticated ? (
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm z-100">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>

              <Transition
                enter="transition-transform transition-opacity duration-300 ease-out"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition-transform transition-opacity duration-300 ease-in"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-full opacity-0"
              >
                <MenuItems
                  className="fixed top-0 left-0 z-50 min-h-screen w-64 md:w-64 sm:w-full transform bg-[#1a2c38] focus:outline-none pt-4"
                >
                  <span className="block px-4 py-2 text-sm hover:bg-[#0f212e]">
                    <p className='text-amber-200'>{user.fullName}</p>
                    <p>{user._id}</p>
                  </span>
                  {user?.role === 'admin' && (
                    <MenuItem>
                      <a
                        href="/admin"
                        className="block px-4 py-2 text-sm hover:bg-[#0f212e] focus:outline-none"
                      >
                        Admin
                      </a>
                    </MenuItem>
                  )}
                  <a href='/change-password' className="block px-4 py-2 text-sm hover:bg-[#0f212e] focus:outline-none cursor-pointer">Change Password</a>

                  {games.map((gameKey) => {
                    const info = gameInfo[gameKey];
                    if (!info) return null;

                    return (
                      <MenuItem key={info.displayName}>
                        <a
                          href={info.link}
                          className="block px-4 py-2 text-sm hover:bg-[#0f212e] focus:outline-none"
                        >
                          {info.displayName}
                        </a>
                      </MenuItem>
                    );
                  })}

                  <MenuItem>
                    <a
                      href="/transactions"
                      className="block px-4 py-2 text-sm hover:bg-[#0f212e] focus:outline-none"
                    >
                      Transactions
                    </a>
                  </MenuItem>

                  <MenuItem>
                    <a
                      onClick={logout}
                      className="block px-4 py-2 text-sm hover:bg-[#0f212e] focus:outline-none cursor-pointer"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>

          ) : (
            <>
              <Link to={"/login"} ><Button children="Login" /></Link>
              <Link to={"/signup"}><Button children="Register" className='bg-blue-500 hover:bg-blue-600' /></Link>
            </>
          )}
        </div>
      </div>

      <div
        className={`${open ? 'flex' : 'hidden'
          } fixed top-0 left-0 z-50 w-screen h-screen bg-white/10 backdrop-blur-sm items-center justify-center`}
      >
        <div className='absolute w-full bg-gray-800 p-4 px-12 bottom-0'>
          {/* Close Button */}
          <button
            className="z-50 text-gray-300 hover:text-red-500 transition right-4 absolute"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Menu Content */}
          <div className="p-6 text-center z-40 mt-12">
            <span className="block bg-amber-300 py-2 rounded text-xl font-medium mb-4 cursor-pointer">Deposit</span>
            <Link to={"/withdraw"} className="block bg-gray-600 py-2 text-amber-50 rounded text-xl font-medium mb-4 cursor-pointer">Withdraw</Link>
            <Link to={"/transactions"} className="block bg-transparent border py-2 text-white rounded text-xl font-medium cursor-pointer">Transaction history</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar