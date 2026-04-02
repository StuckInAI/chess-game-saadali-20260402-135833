import ChessGame from '@/components/ChessGame'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        background: 'linear-gradient(90deg, #f0d9b5, #b58863)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        ♟ Chess Game
      </h1>
      <p style={{ color: '#a8a8b3', marginBottom: '30px', fontSize: '1rem' }}>
        Two-player chess — play with a friend!
      </p>
      <ChessGame />
    </main>
  )
}
