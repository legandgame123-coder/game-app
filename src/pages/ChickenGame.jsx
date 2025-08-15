import Header from '../components/chickenRoad/Header';
import GameBoard from '../components/chickenRoad/GameBoard';

function ChickenGame() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <div className="flex-1 min-h-0 overflow-hidden">
        <GameBoard />
      </div>
    </div>
  );
}

export default ChickenGame;