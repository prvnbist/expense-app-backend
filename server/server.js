import {ApolloServer} from 'apollo-server-express';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// GraphQL Schema
import {schema} from './schema/schema';

// Authentication Functions
import { getToken, getUser } from './auth/Auth';

// Create Express App
const app = express();

// Allow Cross-Origin Requests
app.use(cors());

// Config/Connect to DB
const db = require("./config/keys").mongoURI;
mongoose.set('useCreateIndex', true);
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.log(err));

//Create Apollo Server
const server = new ApolloServer({
    schema,
    context: async({req}) => {
        try {
            if(req.headers.authorization) {
                const token = getToken(req.headers.authorization);
                const {payload} = jwt.verify(token, 'secret');
                if (!payload.tenant) 
                    throw new Error('No Tenant');
                const user = await getUser(payload.tenant);
                return {user}
            }
        } catch (err) {
            console.log(err)
            return {}
        }
    }
});

server.applyMiddleware({app});

app.listen({port: 4000}, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))