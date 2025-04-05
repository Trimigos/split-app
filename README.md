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
- Spring Boot
- RESTful API architecture
- JWT for authentication - Signin with social accounts like google

### Database
- MySQL for relational data storage
- Spring Data JPA for object-relational mapping

## Database Schema

### 1. Users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Spring Boot Entity:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    @Column(unique = true)
    private String email;
    
    @NotBlank
    private String password;
    
    private String phone;
    
    private String avatarUrl;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "creator")
    private List<Group> createdGroups;
    
    @ManyToMany(mappedBy = "members")
    private List<Group> groups;
    
    // Getters and setters
}
```

### 2. Groups
```sql
CREATE TABLE groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  creator_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);
```

**Spring Boot Entity:**
```java
@Entity
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String name;
    
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @ManyToMany
    @JoinTable(
        name = "group_members",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;
    
    // Getters and setters
}
```

### 3. Group_Members
```sql
CREATE TABLE group_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_member (group_id, user_id)
);
```

**Spring Boot Entity:**
```java
@Entity
@Table(name = "group_members", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"}))
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @CreationTimestamp
    private LocalDateTime joinedAt;
    
    // Getters and setters
}
```

### 4. Expenses
```sql
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid_by INT NOT NULL,
  group_id INT NOT NULL,
  split_type ENUM('equal', 'percentage', 'exact') NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paid_by) REFERENCES users(id),
  FOREIGN KEY (group_id) REFERENCES groups(id)
);
```

**Spring Boot Entity:**
```java
@Entity
@Table(name = "expenses")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String description;
    
    @NotNull
    @Column(precision = 10, scale = 2)
    private BigDecimal amount;
    
    @ManyToOne
    @JoinColumn(name = "paid_by", nullable = false)
    private User paidBy;
    
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    private SplitType splitType;
    
    @NotNull
    private LocalDate date;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL)
    private List<ExpenseShare> shares;
    
    // Getters and setters
    
    public enum SplitType {
        EQUAL, PERCENTAGE, EXACT
    }
}
```

### 5. ExpenseShares
```sql
CREATE TABLE expense_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Spring Boot Entity:**
```java
@Entity
@Table(name = "expense_shares")
public class ExpenseShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotNull
    @Column(precision = 10, scale = 2)
    private BigDecimal amount;
    
    private boolean isPaid = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Getters and setters
}
```

### 6. Settlements
```sql
CREATE TABLE settlements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paid_by INT NOT NULL,
  paid_to INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paid_by) REFERENCES users(id),
  FOREIGN KEY (paid_to) REFERENCES users(id)
);
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
- MySQL
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
   MYSQL_URI=your_mysql_connection_string
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