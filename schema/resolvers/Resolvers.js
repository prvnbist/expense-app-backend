import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

// Import MongoDB Schema Models
import User from '../../models/user';
import Expense from '../../models/expense';

import {default as signUp} from '../../schemaValidation/userValidation';

// Resolvers
export const resolvers = {
    Query: {
        me: (_, args, {userId}) => {
            if (!userId) throw new Error('You are not authenticated!');
            return User.findById(userId)
        },
        usersExpenses: async (_, args, {userId}) => {
            const expenses = await Expense.find({
                userId, 
                category: { "$regex": args.category ? args.category : "", "$options": "i" },
                type: { "$regex": args.type ? args.type : "", "$options": "i" },
                spentOn: { "$regex": args.search ? args.search : "", "$options": "i" }
            });
            return expenses.reverse();
        },
        users: async _ => await User.find({}),
        expenses: async _ => await Expense.find({}),
    },
    Expense: {
        user: parent => User.findById(parent.userId)
    },
    User: {
        expenses: async (parent) => await Expense.find({
            userId:parent.id
        })
    },
    Mutation: {
        signup: async (_, args) => {
            const {password,...fields} = args;
            await Joi.validate(args,signUp,{abortEarly:false});
            const user = await User.create({...fields,password: await bcrypt.hash(password, 10)});
            return await jwt.sign({payload: {tenant: user.id}}, 'secret', {expiresIn: '1w'});
        },

        login: async(_, {username, password}) => {
            // Check If User Exists
            const user = await User.findOne({username});
            if (!user) throw new Error('No user with that username');

            // Check If Password Is Correcy
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Incorrect password');

            // Return Token
            return jwt.sign({payload: {tenant: user.id}}, 'secret', {expiresIn: '1w'});
        },

        deleteUser: async(_, {id}, {userId}) => {
            // Check If User Is Authorized
            if(id !== userId) throw new Error('You are not authenticated!');
            return await User.findOneAndDelete({"_id":id})
        },

        updateUser: async(_, {...fields}, {userId}) => {
            const updatedData = {
                ...fields.name && {name: fields.name},
                ...fields.email && {email: fields.email},
                ...fields.username && {username: fields.username},
                ...fields.password && {password: fields.password},
                ...fields.balance && {balance: fields.balance},
                updatedAt: Date.now()
            }
            return await User.findOneAndUpdate({"_id":userId}, {$set: updatedData}, {new: true});
        },

        addExpense: (_, {...fields}, {userId}) => {
            let expense = new Expense({...fields, userId});
			return expense.save();
        },

        deleteExpense: async(_, {id},{userId}) => {
            return await Expense.findOneAndDelete({"_id":id,userId})
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