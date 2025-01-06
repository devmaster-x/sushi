export interface CardNode {
  id: number;
  type: number; // Type ID for determining the image or behavior
  top: number; // Position on Y-axis
  left: number; // Position on X-axis
  offset: number; //Offset position
  array_size: number; // To rearrange cards when layout changes
  size: { width: number; height: number }; // Fixed size
  zIndex: number; // Layering order
  parents: Array<CardNode>; // Parent nodes for layered cards
  state: 'available' | 'unavailable'; // Clickability
  isInBucket: boolean; // Track if card is currently in the bucket
  isInAdditionalSlot: boolean; // Track if card is in additional slot
}

export interface Round {
  roundNumber: number;
  cardTypeNumber: number; // Number of unique card types
  deepLayer: number; // Depth of complexity for the round
  difficulty: boolean;
}

export interface GameState {
  currentRound: Round;
  lives: number; // Initial 3 lives
  cards: CardNode[]; // Cards for the current round
  score: number;
  bucket: CardNode[]; // Cards currently in the bucket
  additionalSlots: CardNode[]; // Cards moved to additional slots
}

export interface User {
  wallet: string;
  username: string; // Added username for identification
  current_score: number;
  top_score: number; // Top score user has achieved
  isVIP: boolean;
}
