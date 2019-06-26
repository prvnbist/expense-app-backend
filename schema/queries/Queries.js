export const typeDefs = `
	type Query {
		me: User
		users: [User]
		expenses(category: String, search: String): [Expense]
	}
`;