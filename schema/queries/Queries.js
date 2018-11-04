export const typeDefs = `
	type Query {
		me: User
		users: [User]
		expenses: [Expense]
	}
`;