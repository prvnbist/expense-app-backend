export const typeDefs = `
	type Mutation {
		signup(
			name:String!, 
			email:String!, 
			password:String!, 
			username: String!,
			gender: String!
		): String

		login(
			username: String!,
			password: String!
		): String

		updateUser(
			name: String,
			email: String,
			username: String,
			password: String,
			balance: String
		) : User

		deleteUser(id: String!) : User

		addExpense(
			spentOn: String!,
			category: String,
			amount: String!,
			description: String
		) : Expense

		deleteExpense(
			id: String!
		) : Expense

		updateExpense(
			id: String!
			spentOn: String,
			category: String,
			amount: String,
			description: String
		) : Expense
	}
`;