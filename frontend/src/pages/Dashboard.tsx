import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store'
import { caseAPI, gameAPI } from '../services/api'
import { Coins, Users, Package, Trophy, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const user = useAuthStore((state) => state.user)

  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: caseAPI.getAllCases,
  })

  const stats = [
    {
      title: 'Balance',
      value: `$${user?.balance?.toLocaleString() || '0'}`,
      icon: Coins,
      color: 'text-casino-gold',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Cases Available',
      value: cases?.length || 0,
      icon: Package,
      color: 'text-primary-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Games',
      value: '2',
      icon: Users,
      color: 'text-casino-green',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Wins Today',
      value: '5',
      icon: Trophy,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.login}!
        </h1>
        <p className="text-gray-400">
          Ready to test your luck? Check out the latest games and cases.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Featured Cases */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Featured Cases</h2>
            <Link to="/cases" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {cases?.slice(0, 3).map((caseItem: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{caseItem.name}</p>
                    <p className="text-gray-400 text-sm">${caseItem.price}</p>
                  </div>
                </div>
                <Link to="/cases" className="btn-primary text-sm px-4 py-2">
                  Open
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-casino-green rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Won a rare card!</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
              </div>
              <span className="text-casino-green text-sm font-medium">+$50</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Opened Premium Case</p>
                  <p className="text-gray-400 text-xs">5 hours ago</p>
                </div>
              </div>
              <span className="text-casino-red text-sm font-medium">-$25</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Joined game lobby</p>
                  <p className="text-gray-400 text-xs">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/cases"
          className="card p-6 hover:bg-gray-700/50 transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-500/10 rounded-full group-hover:bg-primary-500/20 transition-colors">
              <Package className="h-8 w-8 text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Open Cases</h3>
              <p className="text-gray-400 text-sm">Try your luck with mystery boxes</p>
            </div>
          </div>
        </Link>

        <Link
          to="/games"
          className="card p-6 hover:bg-gray-700/50 transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-casino-green/10 rounded-full group-hover:bg-casino-green/20 transition-colors">
              <Users className="h-8 w-8 text-casino-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Join Games</h3>
              <p className="text-gray-400 text-sm">Play with other users</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="card p-6 hover:bg-gray-700/50 transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-casino-gold/10 rounded-full group-hover:bg-casino-gold/20 transition-colors">
              <Trophy className="h-8 w-8 text-casino-gold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">View Profile</h3>
              <p className="text-gray-400 text-sm">Check your stats and history</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
