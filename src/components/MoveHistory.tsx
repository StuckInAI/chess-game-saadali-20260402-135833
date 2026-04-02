'use client'

interface MoveHistoryProps {
  moveHistory: string[]
}

export default function MoveHistory({ moveHistory }: MoveHistoryProps) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '16px',
      width: '220px',
      maxHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
    }}>
      <h3 style={{
        color: '#f0d9b5',
        marginBottom: '12px',
        fontSize: '1rem',
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '8px',
      }}>
        📋 Move History
      </h3>
      <div style={{
        overflowY: 'auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {moveHistory.length === 0 ? (
          <p style={{ color: '#a8a8b3', fontSize: '0.85rem', textAlign: 'center', marginTop: '20px' }}>
            No moves yet
          </p>
        ) : (
          moveHistory.map((move, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: '6px',
                background: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                fontSize: '0.85rem',
              }}
            >
              <span style={{ color: '#a8a8b3', minWidth: '24px', fontSize: '0.75rem' }}>
                {Math.floor(index / 2) + 1}{index % 2 === 0 ? 'w' : 'b'}.
              </span>
              <span style={{ color: '#eaeaea' }}>{move}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
