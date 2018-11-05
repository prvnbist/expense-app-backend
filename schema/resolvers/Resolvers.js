import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import MongoDB Schema Models
import User from '../../models/user';
import Expense from '../../models/expense';

// Resolvers
export const resolvers = {
    Query: {
        me: (_, args, {userId}) => {
            if (!userId) throw new Error('You are not authenticated!');
            return User.findById(userId)
        },
        users: async _ => await User.find({}),
        expenses: async _ => await Expense.find({}),
    },
    Expense: {
        user: parent => User.findById(parent.userId)
    },
    User: {
        expenses: parent => Expense.find({userId:parent.id})
    },
    Mutation: {
        signup: async(_, {password,...fields}) => {
            const user = await User.create({...fields,password: await bcrypt.hash(password, 10)});
            return jwt.sign({payload: {tenant: user.id}}, 'secret', {expiresIn: '1hr'});
        },

        login: async(_, {username, password}) => {
            // Check If User Exists
            const user = await User.findOne({username});
            if (!user) throw new Error('No user with that username');

            // Check If Password Is Correcy
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Incorrect password');

            // Return Token
            return jwt.sign({payload: {tenant: user.id}}, 'secret', {expiresIn: '1hr'});
        },

        deleteUser: async(_, {id}, {userId}) => {
            // Check If User Is Authorized
            if(id !== userId) throw new Error('You are not authenticated!');
            return await User.findOneAndDelete({"_id":id})
        },

        updateUser: async(_, {id,...fields}, {userId}) => {
            // Check If User Is Authorized            
            if(id !== userId) throw new Error('You are not authenticated!');
            const updatedData = {
                ...fields.name && {name: fields.name},
                ...fields.email && {email: fields.email},
                ...fields.username && {username: fields.username},
                ...fields.password && {password: fields.password},
                updatedAt: Date.now()
            }
            return await User.findOneAndUpdate({"_id":id}, {$set: updatedData}, {new: true});
        },

        addExpense: (_, {...fields}, {userId}) => {
            let expense = new Expense({fields, userId});
			return expense.save();
        },

        deleteExpense: async(_, {id},{userId}) => {            
            // Check If User Is Authorized
            if(fields.userId !== userId) throw new Error('You are not authenticated!');
            return await Expense.findOneAndDelete({"_id":id})
        },

        updateExpense: async(_, {id,...fields},{userId}) => {            
            // Check If User Is Authorized
            if(fields.userId !== userId) throw new Error('You are not authenticated!');
            const updatedData = {
                ...fields.spentOn && {spentOn: fields.spentOn},
                ...fields.category && {category: fields.category},
                ...fields.amount && {amount: fields.amount},
                ...fields.description && {description: fields.description},
                updatedAt: Date.now()
            }
            return await Expense.findOneAndUpdate({"_id":id}, {$set: updatedData}, {new: true});
        }
    }
};