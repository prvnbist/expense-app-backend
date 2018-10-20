import {ApolloServer} from 'apollo-server';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

//Create Express App
const app = express();

//Allow Cross-Origin Requests
app.use(cors());

//Import GraphQL Schema
import {schema} from './schema/schema';

//DB config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.log(err));

//Create Apollo Server
const server = new ApolloServer({schema});

//Listen To Server
server
    .listen({
		port: process.env.PORT || 4000
	})
    .then(({url}) => {
        console.log(`🚀 Server ready at ${url}`);
    });