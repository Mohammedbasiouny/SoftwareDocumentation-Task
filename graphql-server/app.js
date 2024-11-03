const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const resolver = require('./resolver');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolver,
  graphiql: true, // Enable GraphiQL for testing the API
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`GraphQL server is running on http://localhost:${PORT}/graphql`);
});