export const typeDefs = `
	type User {
		id: ID!
		name: String!
		email: String!
		username: String!
		balance: String
		expenses(category: String, search: String, type: String): [Expense]
		gender: String!
		createdAt: String
		updatedAt: String
	}
`;