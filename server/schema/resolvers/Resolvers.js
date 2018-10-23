const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

import User from '../../models/user';

export const resolvers = {
    Query: {
        me: async(_, args, {user}) => {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            return await User.findById(user.id)
        }
    },
    Mutation: {
        signup: async(_, {name, username, email, password}) => {
            const user = await User.create({
                name,
                username,
                email,
                password: await bcrypt.hash(password, 10)
            })

            // return json web token
            return jsonwebtoken.sign({
                id: user.id,
                email: user.email
            }, 'secret', {expiresIn: '1y'})
        },

        login: async(_, {username, password}) => {
            const user = await User.findOne({username});
            if (!user) {
                throw new Error('No user with that username')
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Incorrect password')
            }

            return jsonwebtoken.sign({
                _id: user.id,
                email: user.email
            }, 'secret', {expiresIn: '1y'});
        }
    }
};