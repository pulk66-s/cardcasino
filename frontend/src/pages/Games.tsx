import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { gameAPI } from '../services/api'
import { useAuthStore, useGameStore } from '../store'
import { Users, Plus, Play, Clock, Crown, Gamepad2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Games = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [gameName, setGameName] = useState('')
  const user = useAuthStore((state) => state.user)
  const { games, setGames } = useGameStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: gameAPI.listGames,
  })

  // Update games when data changes
  useEffect(() => {
    if (gamesData) {
      setGames(gamesData)
    }
  }, [gamesData, setGames])

  const createGameMutation = useMutation({
    mutationFn: gameAPI.newGame,
    onSuccess: (data) => {
      toast.success('Game created successfully!')
      setShowCreateForm(false)
      setGameName('')
      queryClient.invalidateQueries({ queryKey: ['games'] })
      navigate(`/game/${data.id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create game')
    },
  })

  const joinGameMutation = useMutation({
    mutationFn: gameAPI.joinGame,
    onSuccess: (data) => {
      toast.success('Joined game successfully!')
      navigate(`/game/${data.gameId}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join game')
    },
  })

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gameName.trim()) {
      toast.error('Please enter a game name')
      return
    }
    createGameMutation.mutate(gameName)
  }

  const handleJoinGame = (gameId: number) => {
    joinGameMutation.mutate(gameId)
  }

  const getGameStatusColor = (game: any) => {
    if (game.isStarted) return 'text-casino-red'
    if (game.players?.length >= 4) return 'text-yellow-400'
    return 'text-casino-green'
  }

  const getGameStatusText = (game: any) => {
    if (game.isStarted) return 'In Progress'
    if (game.players?.length >= 4) return 'Full'
    return 'Waiting'
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Lobbies</h1>
          <p className="text-gray-400">
            Create or join a game to start playing with other users
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Game</span>
        </button>
      </div>

      {/* Create Game Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Create New Game</h3>
            <form onSubmit={handleCreateGame}>
              <div className="mb-4">
                <label htmlFor="gameName" className="block text-sm font-medium text-gray-300 mb-2">
                  Game Name
                </label>
                <input
                  id="gameName"
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="input w-full"
                  placeholder="Enter game name"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={createGameMutation.isPending}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {createGameMutation.isPending ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setGameName('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games?.map((game: any) => (
          <div key={game.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
                <p className="text-gray-400 text-sm">
                  Created by {game.createdBy}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getGameStatusColor(game)}`}>
                  {getGameStatusText(game)}
                </span>
                {game.createdBy === user?.login && (
                  <Crown className="h-4 w-4 text-casino-gold" title="Your game" />
                )}
              </div>
            </div>

            {/* Players */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">
                  Players ({game.players?.length || 0}/4)
                </span>
              </div>
              <div className="space-y-1">
                {game.players?.slice(0, 4).map((player: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">
                        {player.login?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm">{player.login}</span>
                    {player.login === user?.login && (
                      <span className="text-casino-gold text-xs">(You)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Actions */}
            <div className="space-y-2">
              {!game.isStarted && game.players?.length < 4 && (
                <button
                  onClick={() => handleJoinGame(game.id)}
                  disabled={
                    joinGameMutation.isPending ||
                    game.players?.some((p: any) => p.login === user?.login)
                  }
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Users className="h-4 w-4" />
                  <span>
                    {game.players?.some((p: any) => p.login === user?.login)
                      ? 'Already Joined'
                      : 'Join Game'}
                  </span>
                </button>
              )}

              {game.players?.some((p: any) => p.login === user?.login) && (
                <button
                  onClick={() => navigate(`/game/${game.id}`)}
                  className="btn-success w-full flex items-center justify-center space-x-2"
                >
                  <Gamepad2 className="h-4 w-4" />
                  <span>Enter Game</span>
                </button>
              )}

              {game.isStarted && (
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Play className="h-4 w-4" />
                  <span className="text-sm">Game in progress</span>
                </div>
              )}

              {!game.isStarted && game.players?.length >= 4 && (
                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Lobby full - waiting to start</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!games || games.length === 0 ? (
        <div className="text-center py-12">
          <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Active Games</h3>
          <p className="text-gray-400 mb-6">
            Be the first to create a game and invite others to play!
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create First Game</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default Games
