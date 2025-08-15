import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import BalanceButton from '../components/BalanceButton'
import { Link } from 'react-router-dom';
import Slider from '../components/Slider';
import Button from '../components/Button';

const Home = () => {
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
      image: "https://cultmtl.com/wp-content/uploads/2025/06/IMG_8547.jpeg",
      link: "/chicken-road"
    },
    mining: {
      displayName: "Gold Miner Quest",
      image: "https://images.sigma.world/mines.jpg",
      link: "/mines"
    },
    aviator: {
      displayName: "Aviator",
      image: "https://enixo.in/wp-content/uploads/2024/10/av.webp",
      link: "/aviator"
    },
    color: {
      displayName: "Colour Trading",
      image: "https://play-lh.googleusercontent.com/vON-GoYSW-3vh2UPsATYje7sBee3H4VNnU-FGNv9gYGZT_HKoztpkP8UvK3K0UVT29I=w526-h296-rw",
      link: "/color-trading"
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#1a2c38]">
      <Navbar />
      <div className='flex flex-col'>
        <div className='py-4 flex gap-4 text-white md:flex-row flex-col-reverse items-center px-4 md:px-24 bg-[url(./header.png)]'>
          <div className='text-center flex gap-2'>
            <Link to={"/signup"}><Button children="Register" className='bg-blue-500 hover:bg-blue-600' /></Link>
            <Button children="Download app"></Button>
          </div>
          <Slider />
        </div>
        <div className="my-8 flex flex-col flex-wrap md:flex-row gap-y-12 md:px-20 px-6 justify-around">
          {games.map((gameKey) => {
            const info = gameInfo[gameKey];
            if (!info) return null; // Skip if game not in predefined object

            return (
              <Link to={info.link} key={gameKey} className="p-1 shadow-xs shadow-gray-700 bg-transparent flex flex-col gap-4 w-full md:w-62">
                <img
                  src={info.image}
                  alt={info.displayName}
                  className="h-52 rounded bg-contain"
                  style={{ objectFit: 'fill', objectPosition: 'center' }}
                />

                <h3 className='text-gray-400 pl-2 flex gap-2'>
                  <span className='min-w-2 max-h-2 mt-2 bg-green-300 rounded-full text-center items-center'></span>
                  <p>{info.displayName}</p>
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Home