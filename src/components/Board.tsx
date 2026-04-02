'use client'

import { GameState } from '@/types/chess'
import { PIECE_SYMBOLS } from '@/utils/chessLogic'

interface BoardProps {
  gameState: GameState
  onSquareClick: (row: number, col: number) => void
}

export default function Board({ gameState, onSquareClick }: BoardProps) {
  const { board, selectedSquare, possibleMoves, currentTurn, isCheck } = gameState

  const isSelected = (r: number, c: number) =>
    selectedSquare ? selectedSquare[0] === r && selectedSquare[1] === c : false

  const isPossibleMove = (r: number, c: number) =>
    possibleMoves.some(([pr, pc]) => pr === r && pc === c)

  const isKingInCheckSquare = (r: number, c: number) => {
    if (!isCheck) return false
    const piece = board[r][c]
    return piece?.type === 'king' && piece?.color === currentTurn
  }

  const colLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Board with row labels */}
      <div style={{ display: 'flex' }}>
        {/* Row labels */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginRight: '6px' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} style={{
              color: '#a8a8b3',
              fontSize: '0.75rem',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
            }}>
              {8 - i}
            </span>
          ))}
        </div>

        {/* Board grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 64px)',
          gridTemplateRows: 'repeat(8, 64px)',
          border: '3px solid #b58863',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {board.map((row, rIdx) =>
            row.map((piece, cIdx) => {
              const isLight = (rIdx + cIdx) % 2 === 0
              const selected = isSelected(rIdx, cIdx)
              const possible = isPossibleMove(rIdx, cIdx)
              const inCheck = isKingInCheckSquare(rIdx, cIdx)
              const hasPiece = !!piece

              let bgColor = isLight ? '#f0d9b5' : '#b58863'
              if (selected) bgColor = isLight ? '#7fc97f' : '#5a9e5a'
              if (inCheck) bgColor = '#e74c3c'

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => onSquareClick(rIdx, cIdx)}
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.15s',
                    userSelect: 'none',
                  }}
                >
                  {/* Possible move indicator */}
                  {possible && !hasPiece && (
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      position: 'absolute',
                      pointerEvents: 'none',
                    }} />
                  )}
                  {/* Possible capture indicator */}
                  {possible && hasPiece && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '0',
                      border: '4px solid rgba(0,0,0,0.3)',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }} />
                  )}
                  {/* Piece */}
                  {piece && (
                    <span style={{
                      fontSize: '44px',
                      lineHeight: 1,
                      cursor: 'pointer',
                      filter: piece.color === 'white'
                        ? 'drop-shadow(1px 1px 1px rgba(0,0,0,0.6))'
                        : 'drop-shadow(1px 1px 1px rgba(255,255,255,0.2))',
                      zIndex: 1,
                      transition: 'transform 0.1s',
                    }}>
                      {PIECE_SYMBOLS[piece.color][piece.type]}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Column labels */}
      <div style={{
        display: 'flex',
        marginLeft: '22px',
        marginTop: '4px',
      }}>
        {colLabels.map(label => (
          <span key={label} style={{
            width: '64px',
            textAlign: 'center',
            color: '#a8a8b3',
            fontSize: '0.75rem',
          }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
