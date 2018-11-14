export const typeDefs = `
	type User {
		id: ID!
		name: String!
		email: String!
		username: String!
		balance: String
		expenses: [Expense]
		gender: String!
		createdAt: String
		updatedAt: String
	}
`;