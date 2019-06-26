export const typeDefs = `
	type Query {
		me: User
		users: [User]
		expenses: [Expense]
		usersExpenses(category: String, search: String, type: String): [Expense]
	}
`;