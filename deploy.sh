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
az login

# Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Registry
echo "Creating Azure Container Registry..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

# # Build backend image directly in Azure ACR
# echo "Building backend image in Azure ACR..."
# az acr build --registry $ACR_NAME --image ${APP_NAME}-backend:latest --platform linux ./SplitApp/backend

# # Build frontend image directly in Azure ACR
# echo "Building frontend image in Azure ACR..."
# az acr build --registry $ACR_NAME --image ${APP_NAME}-frontend:latest --platform linux ./SplitApp/frontend

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