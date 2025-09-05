# Card Casino Frontend

A modern React frontend for the Card Casino application built with TypeScript, Vite, and TailwindCSS.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Game Management**: Create, join, and play in real-time card games
- **Case Opening**: Open mystery cases to win rare cards and items
- **Real-time Communication**: WebSocket integration for live game updates and chat
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **State Management**: Zustand for global state management
- **API Integration**: React Query for efficient data fetching and caching

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom casino theme
- **State Management**: Zustand with persistence
- **API Calls**: Axios with React Query
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:3001
   VITE_WS_URL=http://localhost:3001
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.tsx      # Navigation component
├── pages/              # Route components
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Games.tsx       # Game lobby
│   ├── Cases.tsx       # Case opening
│   ├── GameRoom.tsx    # Individual game room
│   └── Profile.tsx     # User profile
├── services/           # API and external services
│   ├── api.ts          # Axios API client
│   └── websocket.ts    # WebSocket service
├── store/              # State management
│   └── index.ts        # Zustand stores
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Key Features

### Authentication
- JWT-based authentication with automatic token refresh
- Persistent login state across browser sessions
- Protected routes for authenticated users only

### Game Management
- Create and join multiplayer games
- Real-time player updates
- Game owner controls (start game, etc.)
- Live chat in game rooms

### Case Opening
- Browse available mystery cases
- Animated case opening experience
- Rarity-based item system
- Balance management

### Real-time Features
- WebSocket connection for live updates
- Game state synchronization
- Chat messaging
- Player join/leave notifications

## API Integration

The frontend communicates with the NestJS backend through:

- **REST API**: User authentication, game management, case operations
- **WebSocket**: Real-time game updates, chat, notifications

## Styling

Custom TailwindCSS configuration with:
- Casino-themed color palette
- Custom component classes
- Responsive breakpoints
- Dark theme optimized for gaming

## State Management

Uses Zustand for:
- User authentication state
- Game data management
- Case inventory
- UI state management

## Error Handling

- Global error boundaries
- API error interceptors
- User-friendly error messages
- Automatic token refresh on 401 errors

## Performance Optimizations

- React Query for efficient data caching
- Lazy loading of routes
- Optimized bundle splitting
- WebSocket connection management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
