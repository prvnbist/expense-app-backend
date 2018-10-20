import User from '../../models/user';

export const resolvers = {
    Query: {
        users: (parent, args) => User.find({})
    },
    Mutation: {
        addUser: (_, args) => {
			let user = new User({
				name: args.name,
                email: args.email,
                password: args.password,
                income: args.income
			});
			return user.save();
		}
    }
};