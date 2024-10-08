# Instructions

## Restaurant Management Gateway

This application demonstrates the implementation of a gateway and microservices architecture for a restaurant management system. The system is divided into three parts:

1. **Customer Service**: Allows customers to place food orders.
2. **Employee Service**: Enables employees to view and deactivate (mark as served) customer orders.
3. **Management Service**: Provides restaurant statistics, such as the total number of orders, active orders, and the two most popular dishes.

The gateway manages these services, accessible through the following routes:

- **Gateway Base**: `http://localhost:8000`
- **Customer Service**: `http://localhost:8000/customer`
- **Employee Service**: `http://localhost:8000/employee`
- **Management Service**: `http://localhost:8000/management`

Each service runs on its own port and is managed through the gateway.

## Installation

1. **Install Dependencies**:
   In each service folder, you will need to install the necessary dependencies. Navigate to each folder (customer, employee, management, and gateway) and run:

   ```bash
   npm install
   ```

2. **Environment Variables**:

   Due to Azure limitations, i had to immigrate database from Azure to Local and it needs some changing.

   - ENV FOR LOCAL MSQL DATABASE:

   ```bash
   ADMIN_USERNAME="sa"
   ADMIN_PASSWORD="7HT&yp6@CZ&BwKy"
   DATABASE_NAME="mytestdatabase"
   HOST="localhost"
   DIALECT="mssql"
   PORT=8001
   ```

   do not forget to enable localdatabase setting before we use it

   also i needed to adjust connection module `index.js`inside models folder

   ```bash
   const Sequelize = require("sequelize");
   const fs = require("fs");
   const path = require("path");
   const basename = path.basename(__filename);
   require("dotenv").config();
   const sequelize = new Sequelize(
   process.env.DATABASE_NAME,
   process.env.ADMIN_USERNAME,
   process.env.ADMIN_PASSWORD,
   {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: 1433,
    dialectOptions: {
      encrypt: false,
      //instanceName: "SQLEXPRESS",
    },
   }
   );
   const db = {};
   db.sequelize = sequelize;
   fs.readdirSync(__dirname)
   .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
   })
   .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
   });
   Object.keys(db).forEach((modelName) => {
   if (db[modelName].associate) {
    db[modelName].associate(db);
   }
   });
   module.exports = db;
   ```

````


- ENV FOR AZURE
   Each folder contains a `.env.sample` file. For security reasons, the actual `.env` file is not provided. Copy the `.env.sample` file to `.env` in each folder and configure it according to your setup. Each service must have its own port number defined in the `.env` file.
   env example is provided

   ```bash
    ADMIN_USERNAME=<azure-admin-username>
    ADMIN_PASSWORD=<azure-admin-password>
    DATABASE_NAME=<databasename>
    HOST="<databaseservername>ver.database.windows.net"
    DIALECT="mssql"
    PORT=8001
````

3. **Required Packages**:
   The application uses Node.js along with the following key packages:

   - `express`
   - `msnodesqlv8`
   - `mssql`
   - `sequelize`

   Since the app is designed to use Microsoft Azure SQL (MSSQL), you will need the `msnodesqlv8` and `mssql` packages. However, the app can also run with MySQL if you modify the `sequelize` dialect in the models.

4. **CSS Styling**:
   The project uses Bootstrap for styling but references the Bootstrap CDN instead of a local version.

## Running the App

There are two ways to run the application:

### 1. **Manual Start**:

In each service folder (customer, employee, management), start the service using:

```bash
npm start
```

After starting all the services, go to the **gateway** folder and run:

```bash
npm start
```

The gateway will now manage the services via `localhost:8000`.

### 2. **Concurrent Start** (Recommended):

To simplify starting all services at once, the gateway has been configured with **concurrently**. This allows you to start all services with a single command.

In the **gateway** folder, you can simply run:

```bash
npm start
```

This will start the gateway and all services at the same time. However, due to occasional delays in Azure services, there might be timing issues. Check the console output if you encounter any problems.

## Additional Features

- **Main Gateway Interface**: A user-friendly main gateway interface was added for better navigation between customer, employee, and management services.
- **Bootstrap Modal Form for Orders**: Replaced the simple alert-based input for customer orders with a Bootstrap modal form to improve user experience when placing orders.

## TABLE CREATION

If the user wants to create table manually

for MS MSQL :

CREATE TABLE Orders (
OrderId INT IDENTITY(1,1) PRIMARY KEY,
FirstName VARCHAR(255),
LastName VARCHAR(255),
DishName VARCHAR(255),
Active BIT
);
