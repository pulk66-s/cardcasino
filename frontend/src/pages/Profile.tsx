import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store'
import { authAPI } from '../services/api'
import { User, Mail, Calendar, Coins, Trophy, Package, Edit2, Save, X } from 'lucide-react'

const Profile = () => {
  const { user, updateBalance } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    login: user?.login || '',
  })

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: authAPI.profile,
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      // This would be an API call to update profile
      return Promise.resolve(data)
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  const handleSave = () => {
    updateProfileMutation.mutate(editData)
  }

  const handleCancel = () => {
    setEditData({
      login: user?.login || '',
    })
    setIsEditing(false)
  }

  const stats = [
    {
      label: 'Current Balance',
      value: `$${user?.balance?.toLocaleString() || '0'}`,
      icon: Coins,
      color: 'text-casino-gold',
    },
    {
      label: 'Total Games Played',
      value: '23',
      icon: Trophy,
      color: 'text-primary-400',
    },
    {
      label: 'Cases Opened',
      value: '47',
      icon: Package,
      color: 'text-purple-400',
    },
    {
      label: 'Win Rate',
      value: '67%',
      icon: Trophy,
      color: 'text-casino-green',
    },
  ]

  const recentActivity = [
    {
      type: 'case_opened',
      description: 'Opened Premium Case',
      value: '-$25',
      time: '2 hours ago',
      positive: false,
    },
    {
      type: 'card_won',
      description: 'Won Legendary Card',
      value: '+$150',
      time: '2 hours ago',
      positive: true,
    },
    {
      type: 'game_won',
      description: 'Won Card Battle',
      value: '+$50',
      time: '1 day ago',
      positive: true,
    },
    {
      type: 'case_opened',
      description: 'Opened Mystery Box',
      value: '-$15',
      time: '2 days ago',
      positive: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              
              {/* User Info */}
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.login}
                      onChange={(e) => setEditData({ ...editData, login: e.target.value })}
                      className="input text-xl font-bold bg-gray-700"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white">{user?.login}</h1>
                    <p className="text-gray-400">Card Casino Player</p>
                  </>
                )}
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined Dec 2024</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Edit Button */}
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="btn-success flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.positive ? 'bg-casino-green' : 'bg-casino-red'
                    }`}>
                      {activity.type === 'case_opened' && <Package className="h-4 w-4 text-white" />}
                      {activity.type === 'card_won' && <Trophy className="h-4 w-4 text-white" />}
                      {activity.type === 'game_won' && <Trophy className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{activity.description}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                  <span className={`font-medium text-sm ${
                    activity.positive ? 'text-casino-green' : 'text-casino-red'
                  }`}>
                    {activity.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Settings */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-white font-medium mb-2">Security</h3>
                <p className="text-gray-400 text-sm mb-3">Manage your account security settings</p>
                <button className="btn-secondary text-sm">
                  Change Password
                </button>
              </div>
              
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-white font-medium mb-2">Notifications</h3>
                <p className="text-gray-400 text-sm mb-3">Configure notification preferences</p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-gray-300 text-sm">Game invitations</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-gray-300 text-sm">Case results</span>
                  </label>
                </div>
              </div>
              
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-white font-medium mb-2">Data & Privacy</h3>
                <p className="text-gray-400 text-sm mb-3">Manage your data and privacy settings</p>
                <button className="btn-secondary text-sm">
                  Download Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
