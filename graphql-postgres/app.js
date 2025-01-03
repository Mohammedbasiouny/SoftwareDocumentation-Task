// app.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const sequelize = require('./db');
const schema = require('./schema');

const app = express();

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

const PORT = process.env.PORT || 3000;

// Sync with the database and start the server
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/graphql`));
}).catch(error => console.log("Database connection error: ", error));
