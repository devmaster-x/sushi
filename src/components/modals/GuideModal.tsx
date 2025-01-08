interface FailedModalProps {
  handleClick : () => void
}

const FailedModal = (props: FailedModalProps) => {
  const { handleClick } = props;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* <div
        className="bg-contain bg-no-repeat rounded-lg shadow-md overflow-hidden mx-auto w-[220px] h-[150px] flex items-end align-bottom p-8"
        style={{
          backgroundImage: `url(assets/modal/gameover/game_over_bon.png)`,
        }}
      > */}
      <div className = "flex flex-col justify-center gap-8 text-center bg-black mx-auto rounded-lg p-4">
        <p> You need to signup from sushifarm.io site first.</p>
        <a href="www.sushifarm.io" className="text-blue-400"> Go to sushifarm.io</a>
        <div className="flex justify-center w-full">
          {/* <img
            src="assets/modal/gameover/game_over_button.png"
            alt="OK"
            onClick={handleClick}
            className="cursor-pointer hover:opacity-80 w-28 h-6"
          /> */}
        </div>
      </div>
    </div>
  )
}

export default FailedModal;