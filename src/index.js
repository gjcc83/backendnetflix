const {GraphQLServer} = require('graphql-yoga');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const mongoose = require('mongoose');
const verifyToken = require('./utils/verifyToken');

const {importSchema} = require('graphql-import');
const {makeExecutableSchema} = require('graphql-tools');
const {MONGO_URI, TEST_MONGO_URI} = require('./const');

const typeDefs = importSchema('./src/schema.graphql');

const mongoUri = process.env.NODE_ENV === "TEST" ? TEST_MONGO_URI : MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', () => console.log("Failed to connect to mongo"))
    .once('open', () => console.log("Connected to database"))

const resolvers = {
    Query,
    Mutation
}

const schema = {
    typeDefs,
    resolvers
}

const server = new GraphQLServer({
    schema,
    resolvers,
    context: async context => ({
        ...context,
        user:await verifyToken(context.request)
    })
})

const options = {
    port:process.env.PORT || 8000,
    endpoint: '/graphql',
    playground: '/playground',
    cors : {
        credentials: true,
        origin: ["http://localhost:3000"]
    }
}

server.start(options, 
    ({port}) => console.log(`Magic start in port ${port}`))

module.exports = {

    schema

};
