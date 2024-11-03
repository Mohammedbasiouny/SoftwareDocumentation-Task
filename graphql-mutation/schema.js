const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLSchema } = require('graphql');
const uuid = require('uuid');

// Sample data
let books = [
  { id: '1', title: 'Book 1', author: 'Author 1' },
  { id: '2', title: 'Book 2', author: 'Author 2' },
];

// Book Type
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    books: {
      type: new GraphQLList(BookType),
      resolve: () => books,
    },
  },
});

// Mutation
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    addBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { title, author }) => {
        const newBook = {
          id: uuid.v4(),
          title,
          author,
        };
        books.push(newBook);
        return newBook;
      },
    },
    updateBook: {
        type: BookType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          newTitle: { type: new GraphQLNonNull(GraphQLString) },
          newAuthor: {type: new GraphQLNonNull(GraphQLString)},
        },
        resolve: (_, { id, newTitle, newAuthor }) => {
          const book = books.find(book => book.id === id);
          if (book) {
            book.title = newTitle;
            book.author = newAuthor;
            return book;
          }
          return null;
        },
    },
    deleteBook: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { id }) => {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
          books.splice(index, 1);
          return 'Book deleted successfully';
        }
        return 'Book not found';
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