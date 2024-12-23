interface CongratesModalProps {
  handleClick : () => void
}

const CongratesModal = (props: CongratesModalProps) => {
  const { handleClick } = props;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1e1e2f] text-white text-center text-xl font-bold p-6 lg:p-10 rounded-md flex flex-col items-center">
        <p className="text-2xl">Congratulations!</p> 
        <p className="text-x1">You completed this stage.</p>
        <button
          onClick={handleClick}
          className="bg-transparent text-[#098fdd] py-2 px-4 rounded-lg hover:text-gray-600"
        >
          Start Next Stage
        </button>
      </div>
    </div>
  )
}

export default CongratesModal;