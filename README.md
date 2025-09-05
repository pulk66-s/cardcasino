# Card Casino

A full-stack card casino application with real-time multiplayer games, case opening mechanics, and user management.

## Project Structure

```
cardcasino/
├── backend/            # NestJS backend API
├── frontend/           # React frontend application
├── package.json        # Root package.json with scripts
└── README.md          # This file
```

## Features

### Backend (NestJS)
- **User Management**: Registration, login, JWT authentication
- **Game System**: Create, join, and manage multiplayer card games
- **Case Opening**: Mystery box system with card rewards
- **Real-time Features**: WebSocket support for live game updates
- **Database**: PostgreSQL with TypeORM
- **API Documentation**: RESTful endpoints for all operations

### Frontend (React)
- **Modern UI**: React 18 with TypeScript and TailwindCSS
- **Authentication**: JWT-based auth with persistent sessions
- **Real-time Updates**: Socket.IO for live game communication
- **State Management**: Zustand for global state
- **Responsive Design**: Mobile-friendly casino-themed interface

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cardcasino
   ```

2. **Install backend dependencies**:
   ```bash
   npm run install:backend
   ```

3. **Install frontend dependencies**:
   ```bash
   npm run install:frontend
   ```

4. **Set up the database**:
   - Create a PostgreSQL database
   - Update backend environment variables

5. **Configure environment variables**:
   ```bash
   # Backend (.env in backend/)
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_user
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=cardcasino
   JWT_SECRET=your_jwt_secret
   
   # Frontend (.env in frontend/)
   VITE_API_URL=http://localhost:3001
   VITE_WS_URL=http://localhost:3001
   ```

### Development

1. **Start the backend**:
   ```bash
   npm run dev:backend
   ```
   Backend will run on `http://localhost:3001`

2. **Start the frontend** (in a new terminal):
   ```bash
   npm run dev:frontend
   ```
   Frontend will run on `http://localhost:3000`

### Production Build

```bash
# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

## API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile

### Games
- `POST /games/new` - Create new game
- `POST /games/join` - Join existing game
- `POST /games/start` - Start game (owner only)
- `POST /games/players` - Get game players

### Cases
- `GET /cases` - Get all available cases
- `POST /cases/open` - Open a case
- `POST /cases` - Create new case (admin)

### Cards
- `GET /cards` - Get all cards
- `GET /cards/:id` - Get specific card

## WebSocket Events

### Game Events
- `joinGameRoom` - Join a game room
- `leaveGameRoom` - Leave a game room
- `gameUpdate` - Game state updates
- `playerJoined` - Player joined notification
- `playerLeft` - Player left notification
- `gameStarted` - Game started notification

### Chat Events
- `chatMessage` - Send/receive chat messages

## Database Schema

### Users
- `uuid` (Primary Key)
- `login` (Unique)
- `password` (Hashed)
- `balance` (Decimal)
- `created_at`
- `updated_at`

### Games
- `id` (Primary Key)
- `name`
- `created_by`
- `is_started`
- `players` (JSON)
- `created_at`

### Cases
- `id` (Primary Key)
- `name`
- `price`
- `items` (JSON)
- `created_at`

### Cards
- `id` (Primary Key)
- `name`
- `rarity`
- `value`
- `image_url`

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State**: Zustand
- **API**: Axios with React Query
- **Real-time**: Socket.IO Client
- **Routing**: React Router DOM

## Development Workflow

1. **Feature Development**:
   - Create feature branch
   - Implement backend API endpoints
   - Add frontend components
   - Test integration
   - Create pull request

2. **Testing**:
   - Unit tests for business logic
   - Integration tests for API endpoints
   - E2E tests for critical user flows

3. **Deployment**:
   - Backend deployed to cloud service
   - Frontend deployed to CDN
   - Database hosted on cloud provider

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [your-email] or join our Discord community.

## Roadmap

- [ ] Tournament system
- [ ] Trading marketplace
- [ ] Achievement system
- [ ] Mobile app
- [ ] Advanced statistics
- [ ] Social features
