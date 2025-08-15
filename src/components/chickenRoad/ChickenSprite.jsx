const ChickenSprite = ({ position, multiplierRefs, scrollContainer, gameState }) => {
  // Calculate the visual position based on the multiplier position
  const getChickenLeft = () => {
    if (!multiplierRefs.current[position] || !scrollContainer.current) {
      return 28; // Default position
    }

    const multiplierElement = multiplierRefs.current[position];
    const containerElement = scrollContainer.current;

    const multiplierRect = multiplierElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();

    // Calculate position relative to the container
    const relativeLeft = multiplierRect.left - containerRect.left + (multiplierRect.width / 2);

    return relativeLeft;
  };

  return (
    <div
      className="absolute bottom-5 w-14 h-14 transition-all duration-500 ease-in-out z-20"
      style={{
        left: `${getChickenLeft() - 28}px`, // Center the chicken (28px is half of 56px width)
        transform: 'translateY(0)'
      }}
    >
      {gameState == "gameOver" ? <div className="absolute bottom-0 bg-[url(./ice.png)] bg-contain" /> : <div></div>}
{/* <div className="absolute bottom-0 min-w-20 w-auto h-full min-h-40 bg-[url('./fire.png')] bg-contain bg-no-repeat animate-[bgScroll_5s_linear_infinite]" /> */}
{/* <div className="absolute bottom-0 min-w-20 w-auto h-full bg-fire bg-contain bg-no-repeat animate-bg-scroll" /> */}



      <img
        src="/chicken.webp"
        alt="chicken"
        className="w-14 h-14 object-contain drop-shadow-lg"
      />
    </div>
  );
};

export default ChickenSprite;