import { Board, Piece, PieceColor, PieceType, GameState } from '@/types/chess'

export const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
}

export function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))

  const backRank: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRank[col], color: 'black', hasMoved: false }
    board[1][col] = { type: 'pawn', color: 'black', hasMoved: false }
    board[6][col] = { type: 'pawn', color: 'white', hasMoved: false }
    board[7][col] = { type: backRank[col], color: 'white', hasMoved: false }
  }

  return board
}

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentTurn: 'white',
    selectedSquare: null,
    possibleMoves: [],
    capturedWhite: [],
    capturedBlack: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    enPassantTarget: null,
    moveHistory: [],
    gameOver: false,
    winner: null,
  }
}

function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

function findKing(board: Board, color: PieceColor): [number, number] | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece && piece.type === 'king' && piece.color === color) {
        return [r, c]
      }
    }
  }
  return null
}

export function isSquareAttacked(board: Board, row: number, col: number, byColor: PieceColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece && piece.color === byColor) {
        const moves = getRawMoves(board, r, c, null)
        if (moves.some(([mr, mc]) => mr === row && mc === col)) {
          return true
        }
      }
    }
  }
  return false
}

function getRawMoves(board: Board, row: number, col: number, enPassantTarget: [number, number] | null): [number, number][] {
  const piece = board[row][col]
  if (!piece) return []

  const moves: [number, number][] = []
  const { type, color } = piece

  const addIfValid = (r: number, c: number) => {
    if (isInBounds(r, c)) {
      const target = board[r][c]
      if (!target || target.color !== color) {
        moves.push([r, c])
      }
    }
  }

  const addSliding = (directions: [number, number][]) => {
    for (const [dr, dc] of directions) {
      let r = row + dr
      let c = col + dc
      while (isInBounds(r, c)) {
        const target = board[r][c]
        if (target) {
          if (target.color !== color) moves.push([r, c])
          break
        }
        moves.push([r, c])
        r += dr
        c += dc
      }
    }
  }

  switch (type) {
    case 'pawn': {
      const dir = color === 'white' ? -1 : 1
      const startRow = color === 'white' ? 6 : 1

      if (isInBounds(row + dir, col) && !board[row + dir][col]) {
        moves.push([row + dir, col])
        if (row === startRow && !board[row + 2 * dir][col]) {
          moves.push([row + 2 * dir, col])
        }
      }

      for (const dc of [-1, 1]) {
        const nr = row + dir
        const nc = col + dc
        if (isInBounds(nr, nc)) {
          if (board[nr][nc] && board[nr][nc]!.color !== color) {
            moves.push([nr, nc])
          }
          if (enPassantTarget && enPassantTarget[0] === nr && enPassantTarget[1] === nc) {
            moves.push([nr, nc])
          }
        }
      }
      break
    }
    case 'knight': {
      const knightMoves: [number, number][] = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ]
      for (const [dr, dc] of knightMoves) {
        addIfValid(row + dr, col + dc)
      }
      break
    }
    case 'bishop':
      addSliding([[-1, -1], [-1, 1], [1, -1], [1, 1]])
      break
    case 'rook':
      addSliding([[-1, 0], [1, 0], [0, -1], [0, 1]])
      break
    case 'queen':
      addSliding([[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]])
      break
    case 'king': {
      const kingMoves: [number, number][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ]
      for (const [dr, dc] of kingMoves) {
        addIfValid(row + dr, col + dc)
      }
      break
    }
  }

  return moves
}

function isKingInCheck(board: Board, color: PieceColor): boolean {
  const kingPos = findKing(board, color)
  if (!kingPos) return false
  const opponentColor: PieceColor = color === 'white' ? 'black' : 'white'
  return isSquareAttacked(board, kingPos[0], kingPos[1], opponentColor)
}

export function getLegalMoves(board: Board, row: number, col: number, enPassantTarget: [number, number] | null): [number, number][] {
  const piece = board[row][col]
  if (!piece) return []

  const rawMoves = getRawMoves(board, row, col, enPassantTarget)
  const legalMoves: [number, number][] = []

  // Castling
  if (piece.type === 'king' && !piece.hasMoved) {
    const opponentColor: PieceColor = piece.color === 'white' ? 'black' : 'white'
    const kingRow = piece.color === 'white' ? 7 : 0

    if (!isKingInCheck(board, piece.color)) {
      // Kingside
      const rookKS = board[kingRow][7]
      if (rookKS && rookKS.type === 'rook' && !rookKS.hasMoved &&
        !board[kingRow][5] && !board[kingRow][6] &&
        !isSquareAttacked(board, kingRow, 5, opponentColor) &&
        !isSquareAttacked(board, kingRow, 6, opponentColor)) {
        legalMoves.push([kingRow, 6])
      }

      // Queenside
      const rookQS = board[kingRow][0]
      if (rookQS && rookQS.type === 'rook' && !rookQS.hasMoved &&
        !board[kingRow][1] && !board[kingRow][2] && !board[kingRow][3] &&
        !isSquareAttacked(board, kingRow, 3, opponentColor) &&
        !isSquareAttacked(board, kingRow, 2, opponentColor)) {
        legalMoves.push([kingRow, 2])
      }
    }
  }

  for (const [tr, tc] of rawMoves) {
    const newBoard = simulateMove(board, row, col, tr, tc, enPassantTarget)
    if (!isKingInCheck(newBoard, piece.color)) {
      legalMoves.push([tr, tc])
    }
  }

  return legalMoves
}

function simulateMove(board: Board, fromRow: number, fromCol: number, toRow: number, toCol: number, enPassantTarget: [number, number] | null): Board {
  const newBoard: Board = board.map(row => [...row])
  const piece = newBoard[fromRow][fromCol]
  if (!piece) return newBoard

  // En passant capture
  if (piece.type === 'pawn' && enPassantTarget &&
    toRow === enPassantTarget[0] && toCol === enPassantTarget[1]) {
    const capturedPawnRow = piece.color === 'white' ? toRow + 1 : toRow - 1
    newBoard[capturedPawnRow][toCol] = null
  }

  newBoard[toRow][toCol] = { ...piece, hasMoved: true }
  newBoard[fromRow][fromCol] = null

  return newBoard
}

export function applyMove(
  state: GameState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): GameState {
  const newBoard: Board = state.board.map(row => [...row])
  const piece = newBoard[fromRow][fromCol]
  if (!piece) return state

  const newCapturedWhite = [...state.capturedWhite]
  const newCapturedBlack = [...state.capturedBlack]
  let newEnPassantTarget: [number, number] | null = null

  // Capture
  const targetPiece = newBoard[toRow][toCol]
  if (targetPiece) {
    if (targetPiece.color === 'white') newCapturedWhite.push(targetPiece)
    else newCapturedBlack.push(targetPiece)
  }

  // En passant capture
  if (piece.type === 'pawn' && state.enPassantTarget &&
    toRow === state.enPassantTarget[0] && toCol === state.enPassantTarget[1]) {
    const capturedPawnRow = piece.color === 'white' ? toRow + 1 : toRow - 1
    const capturedPawn = newBoard[capturedPawnRow][toCol]
    if (capturedPawn) {
      if (capturedPawn.color === 'white') newCapturedWhite.push(capturedPawn)
      else newCapturedBlack.push(capturedPawn)
    }
    newBoard[capturedPawnRow][toCol] = null
  }

  // Set en passant target
  if (piece.type === 'pawn' && Math.abs(toRow - fromRow) === 2) {
    const epRow = (fromRow + toRow) / 2
    newEnPassantTarget = [epRow, toCol]
  }

  // Castling
  if (piece.type === 'king' && !piece.hasMoved) {
    const kingRow = piece.color === 'white' ? 7 : 0
    if (toCol === 6 && fromCol === 4) {
      // Kingside
      newBoard[kingRow][5] = { ...newBoard[kingRow][7]!, hasMoved: true }
      newBoard[kingRow][7] = null
    } else if (toCol === 2 && fromCol === 4) {
      // Queenside
      newBoard[kingRow][3] = { ...newBoard[kingRow][0]!, hasMoved: true }
      newBoard[kingRow][0] = null
    }
  }

  // Pawn promotion (auto-queen)
  let movedPiece: Piece = { ...piece, hasMoved: true }
  if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
    movedPiece = { type: 'queen', color: piece.color, hasMoved: true }
  }

  newBoard[toRow][toCol] = movedPiece
  newBoard[fromRow][fromCol] = null

  const nextTurn: PieceColor = state.currentTurn === 'white' ? 'black' : 'white'

  // Check/checkmate/stalemate
  const inCheck = isKingInCheck(newBoard, nextTurn)
  const hasLegalMoves = hasAnyLegalMoves(newBoard, nextTurn, newEnPassantTarget)

  let isCheckmate = false
  let isStalemate = false
  let gameOver = false
  let winner: PieceColor | 'draw' | null = null

  if (!hasLegalMoves) {
    if (inCheck) {
      isCheckmate = true
      gameOver = true
      winner = state.currentTurn
    } else {
      isStalemate = true
      gameOver = true
      winner = 'draw'
    }
  }

  // Move notation
  const colLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const notation = `${PIECE_SYMBOLS[piece.color][piece.type]} ${colLetters[fromCol]}${8 - fromRow} → ${colLetters[toCol]}${8 - toRow}`
  const newMoveHistory = [...state.moveHistory, notation]

  return {
    ...state,
    board: newBoard,
    currentTurn: nextTurn,
    selectedSquare: null,
    possibleMoves: [],
    capturedWhite: newCapturedWhite,
    capturedBlack: newCapturedBlack,
    isCheck: inCheck,
    isCheckmate,
    isStalemate,
    enPassantTarget: newEnPassantTarget,
    moveHistory: newMoveHistory,
    gameOver,
    winner,
  }
}

function hasAnyLegalMoves(board: Board, color: PieceColor, enPassantTarget: [number, number] | null): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece && piece.color === color) {
        const moves = getLegalMoves(board, r, c, enPassantTarget)
        if (moves.length > 0) return true
      }
    }
  }
  return false
}
