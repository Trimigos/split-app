@description('The name of the SplitApp application')
param appName string = 'splitapp'

@description('The location to deploy the resources')
param location string = resourceGroup().location

@description('The location to deploy the MySQL server')
param mysqlLocation string = 'centralindia'

@description('MySQL database administrator login name')
@secure()
param administratorLogin string

@description('MySQL database administrator password')
@secure()
param administratorLoginPassword string

@description('MySQL version')
@allowed([
  '5.7'
  '8.0'
])
param mySqlVersion string = '8.0'

// Resource names
var acrName = '${appName}acr'
var containerAppEnvName = '${appName}-env'
var logAnalyticsName = '${appName}-logs'
var mysqlServerName = 'splitapp-sql-1'
var mysqlDbName = 'splitapp'

// Create Log Analytics workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Create Azure Container Registry
resource acr 'Microsoft.ContainerRegistry/registries@2021-09-01' = {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// Create MySQL Flexible server
resource mySqlServer 'Microsoft.DBforMySQL/flexibleServers@2023-12-30' = {
  name: mysqlServerName
  location: mysqlLocation
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: mySqlVersion == '8.0' ? '8.0.21' : '5.7'
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    storage: {
      storageSizeGB: 20
      autoGrow: 'Enabled'
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// Create MySQL database
resource mySqlDb 'Microsoft.DBforMySQL/flexibleServers/databases@2023-12-30' = {
  name: mysqlDbName
  parent: mySqlServer
  properties: {
    charset: 'utf8'
    collation: 'utf8_general_ci'
  }
}

// Create MySQL firewall rule to allow Azure services
resource firewallRule 'Microsoft.DBforMySQL/flexibleServers/firewallRules@2023-12-30' = {
  name: 'AllowAllAzureIPs'
  parent: mySqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '255.255.255.255'
  }
}

// Create Container App Environment
resource containerAppEnv 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: containerAppEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: listKeys(logAnalytics.id, logAnalytics.apiVersion).primarySharedKey
      }
    }
  }
}

// Create Backend Container App
resource backendApp 'Microsoft.App/containerApps@2022-03-01' = {
  name: '${appName}-backend'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8081
      }
      secrets: [
        {
          name: 'db-password'
          value: administratorLoginPassword
        }
        {
          name: 'registry-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
      registries: [
        {
          server: '${acrName}.azurecr.io'
          username: acr.listCredentials().username
          passwordSecretRef: 'registry-password'
        }
      ]
    }
    template: {
      containers: [
        {
          name: '${appName}-backend'
          image: '${acrName}.azurecr.io/${appName}-backend:latest'
          resources: {
            cpu: '0.5'
            memory: '1Gi'
          }
          env: [
            {
              name: 'SPRING_DATASOURCE_URL'
              value: 'jdbc:mysql://${mysqlServerName}.mysql.database.azure.com:3306/${mysqlDbName}?useSSL=true&serverTimezone=UTC'
            }
            {
              name: 'SPRING_DATASOURCE_USERNAME'
              value: '${administratorLogin}@${mysqlServerName}'
            }
            {
              name: 'SPRING_DATASOURCE_PASSWORD'
              secretRef: 'db-password'
            }
            {
              name: 'SPRING_JPA_HIBERNATE_DDL_AUTO'
              value: 'update'
            }
            {
              name: 'SERVER_PORT'
              value: '8081'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
  }
}

// Create Frontend Container App
resource frontendApp 'Microsoft.App/containerApps@2022-03-01' = {
  name: '${appName}-frontend'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 80
      }
      secrets: [
        {
          name: 'registry-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
      registries: [
        {
          server: '${acrName}.azurecr.io'
          username: acr.listCredentials().username
          passwordSecretRef: 'registry-password'
        }
      ]
    }
    template: {
      containers: [
        {
          name: '${appName}-frontend'
          image: '${acrName}.azurecr.io/${appName}-frontend:latest'
          resources: {
            cpu: '0.5'
            memory: '1Gi'
          }
          env: [
            {
              name: 'BACKEND_URL'
              value: 'https://${backendApp.properties.configuration.ingress.fqdn}'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
  }
}

// Outputs
output backendUrl string = 'https://${backendApp.properties.configuration.ingress.fqdn}'
output frontendUrl string = 'https://${frontendApp.properties.configuration.ingress.fqdn}'
output acrLoginServer string = acr.properties.loginServer
