import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef
} from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { User, CardNode, Round } from "src/types/type";

type LeaderBoard = User[];

type GameContextType = {
  currentUser: string;
  currentRound: Round;
  bucket: CardNode[];
  additionalSlots: CardNode[];
  lives: number;
  cards: CardNode[];
  leaderBoard: LeaderBoard;
  score: number;
  slotAvailablity: boolean;
  setCurrentUser: (name: string) => void;
  registerUser: (user?: string ) => Promise<void>;
  restartGame: () => void;
  generateCards: (round: Round) => void;
  startNextRound: () => void;
  loseLife: () => void;
  sendScore: (score: number) => void;
  handleCardClick: (card: CardNode) => void;
  moveToAdditionalSlots: () => void;
  rollbackFromAdditionalSlots: () => void;
  setCards: (cards: CardNode[]) => void;
  setSlotAvailablity: (flag: boolean) => void;
  handleAdditionalCardClick: (card: CardNode) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: PropsWithChildren) => {
  const [currentRound, setCurrentRound] = useState<Round>({
    roundNumber: 1,
    cardTypeNumber: 3,
    deepLayer: 2,
  });
  const [currentUser, setCurrentUser] = useState<string>('');
  const [bucket, setBucket] = useState<CardNode[]>([]);
  const [additionalSlots, setAdditionalSlots] = useState<CardNode[]>([]);
  const [score, setScore] = useState(0);
  const { address, isConnected } = useAppKitAccount();
  const [lives, setLives] = useState(3);
  const [cards, setCards] = useState<CardNode[]>([]);
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard>([]);
  const [slotAvailablity, setSlotAvailablity] = useState(true);
  const loseLifeCalledRef = useRef(false);

  useEffect(()=>{
    console.log("updating: ");
    sendScore(score);
  },[score])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (response.ok) {
        const data: LeaderBoard = await response.json();
        setLeaderBoard(data);
      } else {
        console.error("Failed to fetch leaderboard");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const registerUser = async (userName : string = '') => {
    if (!address) return;
    if(userName == '') userName = `user-${address!.slice(2, 6)}${address!.slice(-4)}`;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          username: userName,
        }),
      });
  
      if (response.ok) {
        fetchLeaderboard();
      } else {
        console.error("Failed to register user.");
      }
    } catch (error) {
      console.error("Error in user registration:", error);
    }
  };
  

  // Mock VIP status check
  const checkVIPStatus = async (wallet: string): Promise<boolean> => {
    // Simulate a smart contract call
    return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.5), 1000));
  };

  const generateCards = (round: Round, offset: number = 1) => {
    const { cardTypeNumber, deepLayer } = round;
    const totalCards = cardTypeNumber * deepLayer * 3;
    const generatedCards: CardNode[] = [];
    const cardSize = 40;
    const allCards: number[] = [];
    const cardAreaSize = Math.floor(Math.sqrt(totalCards) + offset) * cardSize;
    const offset_size = Math.floor((700 - cardAreaSize) / 2);

    // Step 1: Create a pool of cards with shuffled types
    for (let i = 0; i < totalCards; i++) {
      const type = i % cardTypeNumber;
      allCards.push(type);
    }

    // Step 2: Shuffle the cards to randomize their order
    const shuffleCards = (array: number[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    // Function to check if a card overlaps with another card
    const isOverlapping = (left1: number, left2: number, top1: number, top2: number) => {
      return Math.abs(left1 - left2) < cardSize && Math.abs(top1 - top2) < cardSize;
    };

    // Step 3: Generate the cards layer by layer
    for (let layer = deepLayer; layer > 0; layer--) {
      for (let i = 0; i < cardTypeNumber * 3; i++) {
        let top, left;
        let isOverlappingWithExisting = false;
        let parents: CardNode[] = [];
        let retryCount = 0; // Retry counter to avoid infinite loop

        // Find a non-overlapping position
        try {
          do {
            top = Math.floor(Math.random() * (cardAreaSize - cardSize)); // Random top position within the card area
            left = Math.floor(Math.random() * (cardAreaSize - cardSize)); // Random left position within the card area
            isOverlappingWithExisting = false;
            parents = [];

            // Check for overlap with other cards in the same layer and higher layers
            for (const card of generatedCards) {
              if (isOverlapping(card.left, left + offset_size, card.top, top + offset_size)) {
                // If the card is in a higher layer, it's a parent
                if (card.zIndex > layer) {
                  parents.push(card);
                } else if (card.zIndex === layer) {
                  isOverlappingWithExisting = true; // Card in the same layer overlaps
                }
              }
            }

            retryCount++; // Increment retry count
            if (retryCount > 100) { // Maximum retries to avoid infinite loop
              console.log("error was occured : restarting with offest ", offset)
              generateCards(round, offset + 1);
              break;
            }

          } while (isOverlappingWithExisting); // Retry if there was overlap
        } catch (error) {
          console.error("Error while checking overlap:", error);
          continue;
        }

        // Create the card node
        const newCard: CardNode = {
          id: generatedCards.length,
          type: allCards[(cardTypeNumber * 3) * (deepLayer - layer) + i],
          top: offset_size + top,
          left: offset_size + left,
          size: { width: cardSize, height: cardSize },
          zIndex: layer,
          parents,
          state: layer === deepLayer || parents.length === 0 ? "available" : "unavailable", // Cards in the deepest layer or those with no parents are available
          isInBucket: false,
          isInAdditionalSlot: false,
        };

        generatedCards.push(newCard);
      }
    }

    // Shuffle cards to randomize their position and parents
    shuffleCards(allCards);

    // Set the generated cards in state
    setCards(generatedCards);
    setSlotAvailablity(true);
  };

  // Move first three cards to additional slots
  const moveToAdditionalSlots = () => {
    setSlotAvailablity(false);
    setAdditionalSlots((prevSlots) => {
      if (bucket.length >= 3) {
        const firstThree = bucket.slice(0, 3);  // Get first 3 items
        const remainingBucket = bucket.slice(3);  // Get the remaining items after first 3
  
        // Update bucket state with the remaining items
        setBucket(remainingBucket);
  
        // Mark the moved cards as being in the additional slots
        firstThree.forEach(card => card.isInAdditionalSlot = true);
  
        return [...prevSlots, ...firstThree];  // Add the first 3 cards to the additional slots
      }
      return prevSlots;
    });
  };

  // Rollback cards from additional slots to the bucket
  const rollbackFromAdditionalSlots = () => {
    setSlotAvailablity(false);
    setBucket((prevBucket) => {
      const spaceLeft = 6 - prevBucket.length;
      const toMove = additionalSlots.slice(0, spaceLeft);
  
      // Mark the moved cards as not being in the additional slots anymore
      toMove.forEach(card => card.isInAdditionalSlot = false);
  
      setAdditionalSlots((prevSlots) => prevSlots.slice(toMove.length));
      return [...prevBucket, ...toMove];
    });
  };

  // Start the next round
  const startNextRound = () => {
    setBucket([]);
    setAdditionalSlots([]);
    const _round : Round =  {
      roundNumber: currentRound.roundNumber+1, 
      cardTypeNumber: currentRound.cardTypeNumber + 1, 
      deepLayer: currentRound.roundNumber >= 4 ? currentRound.deepLayer + 1 : 2  
    }
    setCurrentRound(_round);
    generateCards(_round);
  };

  const startCurrentRound = () => {
    setBucket([]);
    setAdditionalSlots([]);
    generateCards(currentRound);
  };

  // Add card to the bucket
  const addToBucket = (card: CardNode) => {
    setBucket((prevBucket) => {
      const updatedBucket = [...prevBucket, card];
  
      // Check for triplets in the bucket
      const typeCounts = updatedBucket.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
  
      // If there is a triplet (three cards of the same type), remove them and add points
      for (const [typeId, count] of Object.entries(typeCounts)) {
        if (count >= 3) {
          setScore((prevScore) => {
            const newScore = prevScore + 10; // Award points for triplets
            return newScore;
          });

          // Remove 3 matching cards from the bucket
          const removedCards = updatedBucket.filter((card) => card.type === parseInt(typeId));
          return updatedBucket.filter((card) => !removedCards.includes(card));
        }
      }
  
      // Check for bucket overflow (7 cards limit)
      if (updatedBucket.length === 7 && !loseLifeCalledRef.current) {
        loseLifeCalledRef.current = true; // Mark that loseLife is being called
        setTimeout(() => {
          loseLife();
          loseLifeCalledRef.current = false; // Reset after timeout
        }, 500);
      }
  
      return updatedBucket;
    });
  };

  const loseLife = () => {
    if (lives > 1) {
      setLives((prev) => prev - 1);
      alert("You lost a life!");
      startCurrentRound();
    } else {
      alert("Game Over!");
      restartGame();
    }
  };
  
  const sendScore = async (newScore: number) => {
    if (!address) return;
  
    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          score: newScore,
        }),
      });
  
      if (response.ok) {
        fetchLeaderboard();
      } else {
        console.error("Failed to update leaderboard.");
      }
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };
  
  
  const restartGame = () => {
    setBucket([]);
    setAdditionalSlots([]);
    setLives(3);
    setScore(0);
    setCurrentRound({ roundNumber: 1, cardTypeNumber: 3, deepLayer: 2 });
    generateCards({ roundNumber: 1, cardTypeNumber: 3, deepLayer: 2});
    sendScore(0);
  };

  // Handle card click
  const handleCardClick = (card: CardNode) => {
    if (card.isInAdditionalSlot) {
      setAdditionalSlots((prevSlots) => {
        // Remove the clicked card from the additional slots
        const newSlots = prevSlots.filter((slotCard) => slotCard.id !== card.id);
  
        // Ensure the card is returned to the bucket
        setBucket((prevBucket) => {
          const updatedBucket = [...prevBucket, { ...card, isInAdditionalSlot: false }];
          return updatedBucket;
        });
  
        return newSlots;
      });
      return;
    }
  
    if (card.state !== "available") {
      return;
    }
  
    // Add to the bucket
    addToBucket(card);
  
    // Remove the card from the board (cards state)
    setCards((prevCards) => {
      const updatedCards = prevCards.filter((c) => c.id !== card.id);
  
      // Update the parents of the remaining cards
      return updatedCards.map((c) => {
        if (c.parents.some((parent) => parent.id === card.id)) {
          const updatedParents = c.parents.filter((parent) => parent.id !== card.id);
  
          // If the card has no parents left, set the state to "available"
          if (updatedParents.length === 0) {
            return { ...c, state: "available", parents: updatedParents };
          }
  
          // If there are still parents left, check if all are "available" 
          const allParentsAvailable = updatedParents.every((parent) => parent.state === "available");
          if (allParentsAvailable) {
            return { ...c, state: "unavailable", parents: updatedParents };
          }
  
          // If not all parents are available, leave the state unchanged but update parents
          return { ...c, parents: updatedParents };
        }
  
        // If the card doesn't have `card` as a parent, return it unchanged
        return c;
      });
    });
  };
  
  
  
  const handleAdditionalCardClick = (card: CardNode) => {
    // Move the card back from the additional slots to the bucket
    setAdditionalSlots((prevSlots) => {
      const newSlots = prevSlots.filter((slotCard) => slotCard.id !== card.id);
      return newSlots;
    });
    card.isInAdditionalSlot = false;
    addToBucket(card);
  };

  const value = useMemo(
    () => ({
      currentUser,
      currentRound,
      bucket,
      additionalSlots,
      lives,
      cards,
      leaderBoard,
      isConnected,
      score,
      slotAvailablity,
      setCurrentUser,
      registerUser,
      restartGame,
      generateCards,
      startNextRound,
      loseLife,
      sendScore,
      handleCardClick,
      moveToAdditionalSlots,
      rollbackFromAdditionalSlots,
      setCards,
      setSlotAvailablity,
      handleAdditionalCardClick
    }),
    [
      currentRound,
      bucket,
      additionalSlots,
      lives,
      cards,
      leaderBoard,
      isConnected,
      score,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
