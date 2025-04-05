# SplitApp - Expense Sharing Application

SplitApp is a comprehensive expense-sharing application that allows users to split expenses among groups of people. It's perfect for roommates, trips with friends, or any situation where expenses need to be shared fairly.

## Features

- **User Management**: Register, login, and manage user profiles
- **Group Management**: Create and manage expense groups
- **Expense Tracking**: Add, categorize, and track expenses within groups
- **Expense Splitting**: Split expenses equally or unequally among group members
- **Settlement Tracking**: Keep track of who owes whom, and mark settlements as completed
- **Dashboard**: Visualize expense summaries and balances

## Project Structure

The project is organized into three main layers:

### Backend (Spring Boot)

The backend is built using Spring Boot and provides RESTful APIs for the frontend.

```
backend/
  ├── src/main/java/com/splitapp/
  │   ├── config/            # Application configuration
  │   ├── controller/        # REST API controllers
  │   ├── model/             # Entity classes
  │   ├── repository/        # Data access layer
  │   ├── service/           # Business logic
  │   ├── security/          # Security configuration
  │   └── SplitAppApplication.java
  └── src/main/resources/
      └── application.properties
```

### Frontend (React)

The frontend is built with React and Material-UI for a responsive and modern user interface.

```
frontend/
  ├── public/
  └── src/
      ├── components/
      │   ├── auth/          # Authentication components
      │   ├── layout/        # Layout components
      │   ├── pages/         # Page components
      │   ├── groups/        # Group management components
      │   ├── expenses/      # Expense management components
      │   └── settlements/   # Settlement management components
      ├── services/          # API service calls
      ├── utils/             # Utility functions
      ├── App.js
      └── index.js
```

### Database

MySQL database with tables for users, groups, expenses, expense splits, and settlements.

## Getting Started

### Prerequisites

- Java 11 or higher
- Node.js and npm
- MySQL

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd SplitApp/backend
   ```

2. Configure the database connection in `src/main/resources/application.properties`.

3. Run the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd SplitApp/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open http://localhost:3000 in your browser

## API Endpoints

### User APIs
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/{id}` - Update a user
- `DELETE /api/users/{id}` - Delete a user

### Group APIs
- `GET /api/groups` - Get all groups
- `GET /api/groups/{id}` - Get group by ID
- `POST /api/groups` - Create a new group
- `PUT /api/groups/{id}` - Update a group
- `DELETE /api/groups/{id}` - Delete a group
- `POST /api/groups/{groupId}/members/{userId}` - Add a member to a group
- `DELETE /api/groups/{groupId}/members/{userId}` - Remove a member from a group

### Expense APIs
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses` - Create a new expense
- `DELETE /api/expenses/{id}` - Delete an expense
- `GET /api/expenses/group/{groupId}` - Get expenses by group
- `GET /api/expenses/{expenseId}/splits` - Get splits for an expense

### Settlement APIs
- `GET /api/settlements` - Get all settlements
- `GET /api/settlements/{id}` - Get settlement by ID
- `POST /api/settlements` - Create a new settlement
- `PUT /api/settlements/{id}/status` - Update settlement status
- `DELETE /api/settlements/{id}` - Delete a settlement

## Deployment to Azure Container Apps

SplitApp can be deployed to Azure Container Apps for a production environment. This deployment includes containerized frontend and backend applications, along with an Azure Database for MySQL.

### Prerequisites for Deployment

- Azure CLI installed on your machine
- Docker installed for local testing (optional)
- An active Azure subscription

### Deployment Steps

1. **Prepare your environment**

   Clone the repository and navigate to the project root:
   ```
   git clone https://github.com/yourusername/SplitApp.git
   cd SplitApp
   ```

2. **Review and customize the deployment files**

   - Review `backend/Dockerfile` and `frontend/Dockerfile` to ensure they match your requirements
   - Check `frontend/nginx.conf` for API routing configuration
   - Examine `main.bicep` for Azure resource definitions

3. **Execute the deployment script**

   Make the deployment script executable:
   ```
   chmod +x deploy.sh
   ```

   Run the deployment script:
   ```
   ./deploy.sh
   ```

   The script will:
   - Log you into Azure
   - Create necessary Azure resources
   - Build and push Docker images to Azure Container Registry
   - Deploy the application to Azure Container Apps
   - Set up an Azure Database for MySQL
   - Output deployment URLs and credentials

4. **Verify the deployment**

   After deployment completes, open the frontend URL provided in your browser to access the application.

### Deployment Architecture

```
[Azure Container Registry] → [Container Apps] ← [Azure Database for MySQL]
         ↑                       ↑ ↑
         └─── Build/Push ────────┘ │
                                    │
                      [Log Analytics Workspace]
```

### Infrastructure Components

- **Azure Container Apps**: Hosts the frontend and backend containers
- **Azure Container Registry**: Stores Docker container images
- **Azure Database for MySQL**: Hosts the application database
- **Log Analytics Workspace**: Collects and analyzes logs from your application

### Scaling and Management

- Container Apps automatically scale based on HTTP traffic (1-10 replicas by default)
- Monitor your application using the Azure Portal or Azure CLI
- Update the application by modifying the code and re-running the deployment script

### Manual Deployment

If you prefer to deploy components manually:

1. **Create Azure resources**
   ```
   az group create --name SplitAppRG --location eastus
   ```

2. **Create Azure Container Registry**
   ```
   az acr create --resource-group SplitAppRG --name splitappacr --sku Basic --admin-enabled true
   ```

3. **Build and push Docker images**
   ```
   az acr login --name splitappacr
   cd SplitApp/backend
   az acr build --registry splitappacr --image splitapp-backend:latest .
   cd ../frontend
   az acr build --registry splitappacr --image splitapp-frontend:latest .
   ```

4. **Deploy using Bicep**
   ```
   az deployment group create --resource-group SplitAppRG --template-file ./main.bicep --parameters appName=splitapp
   ```

## Contributing

Please feel free to submit issues or pull requests to improve the application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.