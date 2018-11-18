export const typeDefs = `
	type Expense {
		id: ID!
		spentOn: String!
		category: String
        amount: String!
        description: String
		user: User!
		type: String!
		createdAt: String
		updatedAt: String
	}
`;