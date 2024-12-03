import { FC, useState } from 'react';

interface CardNode {
  id: string;
  type: string;
  top: number;
  left: number;
  zIndex: number;
  parents: Array<{ state: number }>;
}

interface CardProps {
  node: CardNode;
  isDock?: boolean;
  onClickCard: (node: CardNode) => void;
}

const Card: FC<CardProps> = ({ node, isDock = false, onClickCard }) => {
  const [isFreeze, setIsFreeze] = useState<boolean>(
    node.parents.length > 0 ? node.parents.some(o => o.state < 2) : false
  );

  const handleClick = () => {
    if (!isFreeze) {
      onClickCard(node);
    }
  };

  const IMG_MAP: Record<string, string> = {
    sushi1: '/images/sushi/sushi1.png',
    sushi2: '/images/sushi/sushi2.png',
    sushi3: '/images/sushi/sushi3.png',
    sushi4: '/images/sushi/sushi4.png',
    // Add other sushi images as needed
  };

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 bg-[#f9f7e1] text-black relative rounded-sm border border-black shadow-md cursor-pointer 
        ${!isDock ? 'absolute' : ''} ${isFreeze ? 'bg-gray-400' : ''}`}
      style={
        !isDock ? { zIndex: node.zIndex, top: `${node.top}px`, left: `${node.left}px` } : {}
      }
      onClick={handleClick}
    >
      <img
        src={IMG_MAP[node.type]}
        alt={node.type}
        width={40}
        height={40}
        className="rounded"
      />
      {isFreeze && (
        <div className="absolute top-0 left-0 bg-black opacity-50 w-full h-full pointer-events-none" />
      )}
    </div>
  );
};

export default Card;
