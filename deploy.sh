#!/bin/bash
set -e

# Variables
RESOURCE_GROUP="SplitAppRG"
LOCATION="eastus"
APP_NAME="splitapp"
ACR_NAME="${APP_NAME}acr"
ADMIN_USERNAME="dbadmin"

# Generate a random password for MySQL
DB_PASSWORD=$(openssl rand -base64 16)

# Log in to Azure
echo "Logging in to Azure..."
az login --use-device-code

# Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Build and push Docker images
echo "Building and pushing Docker images..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true
az acr login --name $ACR_NAME

# Build backend image
echo "Building backend image..."
cd ./SplitApp/backend
az acr build --registry $ACR_NAME --image ${APP_NAME}-backend:latest .

# Build frontend image
echo "Building frontend image..."
cd ../frontend
az acr build --registry $ACR_NAME --image ${APP_NAME}-frontend:latest .
cd ../..

# Deploy with Bicep
echo "Deploying Azure resources..."
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file ./main.bicep \
  --parameters appName=$APP_NAME \
  --parameters administratorLogin=$ADMIN_USERNAME \
  --parameters administratorLoginPassword=$DB_PASSWORD

# Get the output URLs
BACKEND_URL=$(az deployment group show --resource-group $RESOURCE_GROUP --name main --query properties.outputs.backendUrl.value -o tsv)
FRONTEND_URL=$(az deployment group show --resource-group $RESOURCE_GROUP --name main --query properties.outputs.frontendUrl.value -o tsv)

echo "Deployment complete!"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "MySQL username: $ADMIN_USERNAME"
echo "MySQL password: $DB_PASSWORD"
echo "Please save your MySQL credentials in a secure location."