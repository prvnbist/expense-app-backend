export const typeDefs = `
	type Expense {
		id: ID!
		spentOn: String!
		category: String
        amount: String!
        description: String
		user: User!
		createdAt: String
		updatedAt: String
	}
`;