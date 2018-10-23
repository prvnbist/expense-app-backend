export const typeDefs = `
	type Mutation {		
		signup(name:String!, email:String!, password:String!, username: String!): String
		login(username: String!,password: String!): String
	}
`;