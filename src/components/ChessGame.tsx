'use client'

import { useState, useCallback } from 'react'
import { createInitialGameState, getLegalMoves, applyMove, PIECE_SYMBOLS } from '@/utils/chessLogic'
import { GameState } from '@/types/chess'
import Board from './Board'
import GameInfo from './GameInfo'
import MoveHistory from './MoveHistory'

export default function ChessGame() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState)

  const handleSquareClick = useCallback((row: number, col: number) => {
    setGameState(prev => {
      if (prev.gameOver) return prev

      const { board, currentTurn, selectedSquare, possibleMoves, enPassantTarget } = prev
      const clickedPiece = board[row][col]

      // If a square is already selected
      if (selectedSquare) {
        const [selRow, selCol] = selectedSquare

        // Check if clicking a possible move
        const isMove = possibleMoves.some(([r, c]) => r === row && c === col)
        if (isMove) {
          return applyMove(prev, selRow, selCol, row, col)
        }

        // Clicking own piece — reselect
        if (clickedPiece && clickedPiece.color === currentTurn) {
          const moves = getLegalMoves(board, row, col, enPassantTarget)
          return { ...prev, selectedSquare: [row, col], possibleMoves: moves }
        }

        // Deselect
        return { ...prev, selectedSquare: null, possibleMoves: [] }
      }

      // No square selected — select if own piece
      if (clickedPiece && clickedPiece.color === currentTurn) {
        const moves = getLegalMoves(board, row, col, enPassantTarget)
        return { ...prev, selectedSquare: [row, col], possibleMoves: moves }
      }

      return prev
    })
  }, [])

  const handleReset = useCallback(() => {
    setGameState(createInitialGameState())
  }, [])

  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <GameInfo gameState={gameState} onReset={handleReset} />
        <Board gameState={gameState} onSquareClick={handleSquareClick} />
        <CapturedPieces gameState={gameState} />
      </div>
      <MoveHistory moveHistory={gameState.moveHistory} />
    </div>
  )
}

function CapturedPieces({ gameState }: { gameState: GameState }) {
  const { capturedWhite, capturedBlack } = gameState

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#a8a8b3', fontSize: '0.8rem', minWidth: '80px' }}>Captured (W):</span>
        <span style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
          {capturedWhite.map((p, i) => (
            <span key={i}>{PIECE_SYMBOLS[p.color][p.type]}</span>
          ))}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#a8a8b3', fontSize: '0.8rem', minWidth: '80px' }}>Captured (B):</span>
        <span style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
          {capturedBlack.map((p, i) => (
            <span key={i}>{PIECE_SYMBOLS[p.color][p.type]}</span>
          ))}
        </span>
      </div>
    </div>
  )
}
