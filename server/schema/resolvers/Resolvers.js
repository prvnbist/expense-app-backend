import User from '../../models/user';

export const resolvers = {
    Query: {
        users: (parent, args) => User.find({})
    },
    Mutation: {
        addUser: (_, {name,email,password,income,username}) => {
			let user = new User({
				name,
                email,
                password,
                income,
                username 
			});
			return user.save();
		}
    }
};