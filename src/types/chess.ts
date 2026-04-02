export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
export type PieceColor = 'white' | 'black'

export interface Piece {
  type: PieceType
  color: PieceColor
  hasMoved?: boolean
}

export interface Square {
  piece: Piece | null
  row: number
  col: number
}

export type Board = (Piece | null)[][]

export interface GameState {
  board: Board
  currentTurn: PieceColor
  selectedSquare: [number, number] | null
  possibleMoves: [number, number][]
  capturedWhite: Piece[]
  capturedBlack: Piece[]
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  enPassantTarget: [number, number] | null
  moveHistory: string[]
  gameOver: boolean
  winner: PieceColor | 'draw' | null
}
