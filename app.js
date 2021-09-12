const express = require('express');
const mongoose = require('mongoose');
const typeDefs = require('./types')
const resolvers = require("./resolvers");
const bodyParser = require('body-parser');
const cors = require('cors');
const {
    ApolloServer
} = require('apollo-server-express');

//To connect to database
const getMe = async req => {
      const token = req.headers['x-token'];
      return {token}
}
const url = "mongodb://localhost:27017/students";
const connect = mongoose.connect(url, {
    useNewUrlParser: true
});
connect.then((db) => {
    console.log('Connected correctly to server!');
}, (err) => {
    console.log(err);
});

const app = express();
app.use(bodyParser.json());
app.use('*', cors());
async function startApolloServer() {

    const server = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        context: async ({ req }) => {
            const me = await getMe(req);
            return me
      }
           
    });
    async function serverStart() {
        await server.start()
        server.applyMiddleware({
            app
        });
    }

    serverStart();

    app.listen({
            port: 4000
        }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
}
startApolloServer()