export const typeDefs = `
	type Mutation {		
		addUser(name:String, email:String, password:String, income:String, username: String): User
	}
`;