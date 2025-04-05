# SplitApp

A web application for splitting expenses among friends, roommates, or groups.

## Project Overview

SplitApp is a user-friendly expense sharing application that helps users track, manage, and settle shared expenses. Whether you're on a trip with friends, sharing an apartment, or managing group expenses, SplitApp makes it easy to keep track of who owes whom.

## Core Features

- **User Management**: Register, login, profile management
- **Group Management**: Create and manage expense groups
- **Expense Tracking**: Add, edit, and delete expenses
- **Flexible Splitting Options**: Split expenses equally, by percentage, or by specific amounts
- **Balance Tracking**: View who oweswhat to whom
- **Settlement**: Mark expenses as settled and keep transaction history
- **Dashboard**: Visual representation of expenses and balances

## Technical Architecture

### Frontend
- React.js for the web interface
- Redux for state management
- Responsive design for mobile and desktop users

### Backend
- Node.js with Express.js
- RESTful API architecture
- JWT for authentication

### Database
- MongoDB for data storage
- Mongoose for object modeling

## Database Schema

### 1. Users
```
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String (optional),
  avatarUrl: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Groups
```
{
  _id: ObjectId,
  name: String,
  description: String,
  creator: ObjectId (ref: Users),
  members: [ObjectId] (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Expenses
```
{
  _id: ObjectId,
  description: String,
  amount: Number,
  paidBy: ObjectId (ref: Users),
  group: ObjectId (ref: Groups),
  splitType: String (enum: "equal", "percentage", "exact"),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. ExpenseShares
```
{
  _id: ObjectId,
  expense: ObjectId (ref: Expenses),
  user: ObjectId (ref: Users),
  amount: Number,
  isPaid: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Settlements
```
{
  _id: ObjectId,
  paidBy: ObjectId (ref: Users),
  paidTo: ObjectId (ref: Users),
  amount: Number,
  date: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/:id/balances` - Get balances for a user

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get all groups for user
- `GET /api/groups/:id` - Get group by ID
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add members to group
- `DELETE /api/groups/:id/members/:userId` - Remove member from group

### Expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses` - Get all expenses for user
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/groups/:id/expenses` - Get expenses for a group

### Settlements
- `POST /api/settlements` - Create new settlement
- `GET /api/settlements` - Get all settlements for user
- `GET /api/settlements/:id` - Get settlement by ID

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
   ```
   git clone https://github.com/yourusername/splitapp.git
   cd splitapp
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Future Enhancements
- Mobile app using React Native
- Email notifications for new expenses and reminders
- Integration with payment gateways
- Currency conversion for international expenses
- Receipt scanning and automatic expense creation
- Expense categories and reporting