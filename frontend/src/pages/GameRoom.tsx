import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { gameAPI } from '../services/api'
import { useAuthStore } from '../store'
import { webSocketService } from '../services/websocket'
import { Users, Play, Crown, MessageCircle, Settings, ArrowLeft } from 'lucide-react'

const GameRoom = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [gameData, setGameData] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')

  const { data: players } = useQuery({
    queryKey: ['game-players', gameId],
    queryFn: () => gameAPI.getPlayers(Number(gameId)),
    enabled: !!gameId,
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  const startGameMutation = useMutation({
    mutationFn: () => gameAPI.startGame(Number(gameId)),
    onSuccess: () => {
      toast.success('Game started!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start game')
    },
  })

  // WebSocket event handlers
  useEffect(() => {
    if (!gameId) return

    const socket = webSocketService.getSocket()
    if (!socket) return

    // Join game room
    socket.emit('joinGameRoom', { gameId: Number(gameId) })

    // Listen for game events
    socket.on('gameUpdate', (data) => {
      setGameData(data)
    })

    socket.on('playerJoined', (data) => {
      toast.success(`${data.playerName} joined the game`)
    })

    socket.on('playerLeft', (data) => {
      toast.success(`${data.playerName} left the game`)
    })

    socket.on('gameStarted', () => {
      toast.success('Game has started!')
      setGameData((prev: any) => ({ ...prev, isStarted: true }))
    })

    socket.on('chatMessage', (data) => {
      setMessages((prev) => [...prev, data])
    })

    return () => {
      socket.off('gameUpdate')
      socket.off('playerJoined')
      socket.off('playerLeft')
      socket.off('gameStarted')
      socket.off('chatMessage')
      socket.emit('leaveGameRoom', { gameId: Number(gameId) })
    }
  }, [gameId])

  const handleStartGame = () => {
    if (!players || players.length < 2) {
      toast.error('Need at least 2 players to start')
      return
    }
    startGameMutation.mutate()
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const socket = webSocketService.getSocket()
    if (socket) {
      socket.emit('chatMessage', {
        gameId: Number(gameId),
        message: newMessage,
        playerName: user?.login,
      })
      setNewMessage('')
    }
  }

  const isGameOwner = gameData?.createdBy === user?.login

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/games')}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Games</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {gameData?.name || 'Game Room'}
            </h1>
            <p className="text-gray-400">Game ID: {gameId}</p>
          </div>
        </div>
        
        {isGameOwner && !gameData?.isStarted && (
          <button
            onClick={handleStartGame}
            disabled={startGameMutation.isPending || (players && players.length < 2)}
            className="btn-success flex items-center space-x-2 disabled:opacity-50"
          >
            <Play className="h-5 w-5" />
            <span>Start Game</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Status */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Game Status</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                gameData?.isStarted 
                  ? 'bg-casino-red text-white' 
                  : 'bg-casino-green text-white'
              }`}>
                {gameData?.isStarted ? 'In Progress' : 'Waiting to Start'}
              </span>
            </div>
            
            {!gameData?.isStarted ? (
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin-slow" />
                <h3 className="text-lg font-bold text-white mb-2">Waiting for Game to Start</h3>
                <p className="text-gray-400">
                  {isGameOwner 
                    ? 'You can start the game when ready'
                    : 'Waiting for the game owner to start the game'
                  }
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Play className="h-16 w-16 text-casino-green mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Game in Progress</h3>
                <p className="text-gray-400">
                  The game is currently being played
                </p>
              </div>
            )}
          </div>

          {/* Game Actions */}
          {gameData?.isStarted && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Game Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="btn-primary">
                  Draw Card
                </button>
                <button className="btn-secondary">
                  Play Card
                </button>
                <button className="btn-danger">
                  Fold
                </button>
                <button className="btn-success">
                  Call
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Players */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-white">
                Players ({players?.length || 0}/4)
              </h2>
            </div>
            
            <div className="space-y-3">
              {players?.map((player: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {player.login?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{player.login}</p>
                      {player.login === user?.login && (
                        <p className="text-casino-gold text-sm">You</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {gameData?.createdBy === player.login && (
                      <Crown className="h-4 w-4 text-casino-gold" />
                    )}
                    <div className="w-3 h-3 bg-casino-green rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-white">Chat</h2>
            </div>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="text-sm">
                  <span className="text-primary-400 font-medium">
                    {message.playerName}:
                  </span>
                  <span className="text-gray-300 ml-2">{message.message}</span>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No messages yet. Say hello!
                </p>
              )}
            </div>
            
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input flex-1 text-sm"
                placeholder="Type a message..."
              />
              <button type="submit" className="btn-primary px-3 py-2 text-sm">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameRoom
