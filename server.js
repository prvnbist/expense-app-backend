import {ApolloServer} from 'apollo-server-express';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

// GraphQL Schema
import {schema} from './schema/schema';

// Authentication Functions
import {verifyUser} from './auth/Auth';

// Create Express App
const app = express();

if (process.env.NODE_ENV !== "production") {
    // Allow Cross-Origin Requests
    app.use(cors({
        origin:'http://localhost:3000',
        credentials: true
    }));
}

// Config/Connect to DB
const db = require("./config/keys").mongoURI;
mongoose.set('useCreateIndex', true);
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.log(err));

// const TOKEN = localStorage.getItem('access_token');
// console.log(TOKEN);

//Create Apollo Server
const server = new ApolloServer({
    schema,
    context: ({req, res}) => ({userId: verifyUser(req), res}),
    debug: true,
    tracing: true,
    introspection: true,
    playground: true
});

server.applyMiddleware({app});
app.listen({
    port: process.env.PORT || 4000
}, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
