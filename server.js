import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

// GraphQL Schema
import { schema } from "./schema/schema";

// Authentication Functions
import { verifyUser } from "./auth/Auth";

// Create Express App
const app = express();

// Allow Cross-Origin Requests
app.use(cors());

require("dotenv").config();
// Config/Connect to DB
mongoose.set("useCreateIndex", true);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.log(err));

//Create Apollo Server
const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ userId: verifyUser(req), res })
});

server.applyMiddleware({ app });
app.listen(
  {
    port: process.env.PORT || 4000
  },
  () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
