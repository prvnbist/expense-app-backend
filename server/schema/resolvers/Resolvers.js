const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import User from '../../models/user';

export const resolvers = {
    Query: {
        me: async(_, args, {user}) => {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            return await User.findById(user.id)
        },
        users: async _ => await User.find({})
    },
    Mutation: {
        signup: async(_, {name, username, email, password}) => {
            const user = await User.create({
                name,
                username,
                email,
                password: await bcrypt.hash(password, 10)
            })

            return jwt.sign({
                payload: {
                    tenant: user.id
                }
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

            return jwt.sign({
                payload: {
                    tenant: user.id
                }
            }, 'secret', {expiresIn: '1y'});
        }
    }
};