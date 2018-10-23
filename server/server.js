import {ApolloServer} from 'apollo-server';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import jwt from 'express-jwt';

//Create Express App
const app = express();

//Allow Cross-Origin Requests
app.use(cors());

//Import GraphQL Schema
import {schema} from './schema/schema';

//DB config
const db = require("./config/keys").mongoURI;

mongoose.set('useCreateIndex', true);
//Connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.log(err));

// authentication middleware
const authMiddleware = jwt({
    secret: 'secret',
    credentialsRequired: false
});

app.use(authMiddleware);

//Create Apollo Server
const server = new ApolloServer({
    schema,
    context: ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization || '';
        
        // try to retrieve a user with the token
        const user = token => {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        };
        
        if (!user) throw new AuthorizationError('you must be logged in');

        // add the user to the context
        return { user };
    }
});

//Listen To Server
server
    .listen({port: process.env.PORT || 4000})
    .then(({url}) => console.log(`🚀 Server ready at ${url}`));