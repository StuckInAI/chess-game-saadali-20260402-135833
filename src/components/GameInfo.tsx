'use client'

import { GameState } from '@/types/chess'

interface GameInfoProps {
  gameState: GameState
  onReset: () => void
}

export default function GameInfo({ gameState, onReset }: GameInfoProps) {
  const { currentTurn, isCheck, isCheckmate, isStalemate, gameOver, winner } = gameState

  const getStatusMessage = () => {
    if (isCheckmate) {
      return {
        text: `Checkmate! ${winner === 'white' ? 'White' : 'Black'} wins! 🏆`,
        color: '#e94560',
      }
    }
    if (isStalemate) {
      return {
        text: "Stalemate! It's a draw! 🤝",
        color: '#f39c12',
      }
    }
    if (isCheck) {
      return {
        text: `${currentTurn === 'white' ? 'White' : 'Black'} is in Check! ⚠️`,
        color: '#e74c3c',
      }
    }
    return {
      text: `${currentTurn === 'white' ? '⬜ White' : '⬛ Black'}'s Turn`,
      color: currentTurn === 'white' ? '#f0d9b5' : '#a8a8b3',
    }
  }

  const status = getStatusMessage()

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: status.color,
          transition: 'color 0.3s',
        }}>
          {status.text}
        </div>
        {!gameOver && (
          <div style={{ fontSize: '0.75rem', color: '#a8a8b3', marginTop: '4px' }}>
            Click a piece to select, then click a highlighted square to move
          </div>
        )}
      </div>
      <button
        onClick={onReset}
        style={{
          background: 'linear-gradient(135deg, #b58863, #f0d9b5)',
          color: '#1a1a2e',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'opacity 0.2s, transform 0.1s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        🔄 New Game
      </button>
    </div>
  )
}
