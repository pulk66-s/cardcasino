import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { caseAPI } from '../services/api'
import { useAuthStore } from '../store'
import { Package, Star, Coins, Sparkles, RefreshCw } from 'lucide-react'

interface CaseOpenResult {
  card: {
    id: number
    name: string
    rarity: string
    value: number
  }
}

const Cases = () => {
  const [openingCase, setOpeningCase] = useState<number | null>(null)
  const [lastOpenedResult, setLastOpenedResult] = useState<CaseOpenResult | null>(null)
  const user = useAuthStore((state) => state.user)
  const updateBalance = useAuthStore((state) => state.updateBalance)
  const queryClient = useQueryClient()

  const { data: cases, isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: caseAPI.getAllCases,
  })

  const openCaseMutation = useMutation({
    mutationFn: caseAPI.openCase,
    onSuccess: (data) => {
      setLastOpenedResult(data)
      // Update user balance
      if (user) {
        updateBalance(user.balance - data.casePrice + data.card.value)
      }
      toast.success(`You got: ${data.card.name}!`)
      setOpeningCase(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to open case')
      setOpeningCase(null)
    },
  })

  const handleOpenCase = (caseItem: any) => {
    if (!user) {
      toast.error('Please log in to open cases')
      return
    }

    if (user.balance < caseItem.price) {
      toast.error('Insufficient balance')
      return
    }

    setOpeningCase(caseItem.id)
    openCaseMutation.mutate(caseItem.id)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'text-gray-400 border-gray-400'
      case 'uncommon':
        return 'text-green-400 border-green-400'
      case 'rare':
        return 'text-blue-400 border-blue-400'
      case 'epic':
        return 'text-purple-400 border-purple-400'
      case 'legendary':
        return 'text-casino-gold border-casino-gold'
      default:
        return 'text-gray-400 border-gray-400'
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mystery Cases</h1>
        <p className="text-gray-400">
          Open cases to discover rare cards and valuable items. Each case contains different rarities and rewards!
        </p>
      </div>

      {/* Last Opened Result */}
      {lastOpenedResult && (
        <div className="card p-6 mb-8 border-2 border-casino-gold">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Last Opened!</h2>
            <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-white mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">{lastOpenedResult.card.name}</h3>
                <p className={`text-sm ${getRarityColor(lastOpenedResult.card.rarity).split(' ')[0]}`}>
                  {lastOpenedResult.card.rarity}
                </p>
                <p className="text-casino-gold font-bold mt-2">
                  Value: ${lastOpenedResult.card.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cases?.map((caseItem: any) => (
          <div key={caseItem.id} className="casino-card">
            <div className="card p-6 h-full flex flex-col">
              {/* Case Image/Icon */}
              <div className="relative mb-4">
                <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Package className="h-16 w-16 text-white" />
                </div>
                <div className="absolute top-2 right-2">
                  <Star className="h-6 w-6 text-casino-gold" />
                </div>
              </div>

              {/* Case Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{caseItem.name}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Contains rare cards and exclusive items. Good luck!
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-casino-gold" />
                    <span className="text-xl font-bold text-casino-gold">
                      ${caseItem.price}
                    </span>
                  </div>
                </div>

                {/* Possible Items Preview */}
                {caseItem.items && caseItem.items.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Possible items:</p>
                    <div className="flex flex-wrap gap-1">
                      {caseItem.items.slice(0, 3).map((item: any, index: number) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded border ${getRarityColor(item.rarity || 'common')}`}
                        >
                          {item.name}
                        </span>
                      ))}
                      {caseItem.items.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded border border-gray-400 text-gray-400">
                          +{caseItem.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Open Button */}
              <button
                onClick={() => handleOpenCase(caseItem)}
                disabled={
                  openingCase === caseItem.id || 
                  (user && user.balance < caseItem.price) ||
                  openCaseMutation.isPending
                }
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {openingCase === caseItem.id ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Opening...</span>
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5" />
                    <span>
                      Open Case {user && user.balance < caseItem.price ? '(Insufficient Funds)' : ''}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!cases || cases.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Cases Available</h3>
          <p className="text-gray-400">
            Check back later for new mystery cases to open!
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default Cases
