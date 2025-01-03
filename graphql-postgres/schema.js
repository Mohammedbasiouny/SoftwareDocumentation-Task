// schema.js
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLSchema } = require('graphql');
const Book = require('./models/book');

// Book Type
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: {
    id: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    author: { type: GraphQLNonNull(GraphQLString) },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    books: {
      type: new GraphQLList(BookType),
      resolve: async () => {
        return await Book.findAll();
      },
    },
  },
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        author: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { title, author }) => {
        const newBook = await Book.create({ title, author });
        return newBook;
      },
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        newTitle: { type: GraphQLNonNull(GraphQLString) },
        newAuthor: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { id, newTitle, newAuthor }) => {
        const book = await Book.findByPk(id);
        if (book) {
          book.title = newTitle;
          book.author = newAuthor;
          await book.save();
          return book;
        }
        return null;
      },
    },
    deleteBook: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { id }) => {
        const deleted = await Book.destroy({ where: { id } });
        return deleted ? 'Book deleted successfully' : 'Book not found';
      },
    },
  },
});

// Create GraphQL Schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = schema;
