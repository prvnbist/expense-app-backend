import mongoose from 'mongoose';
import validator from 'validator';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required."]
    },
    username: {
        type: String,
        lowercase: true,
        required: [
            true, "Username is required."
        ],
        unique: true,
        match: [
            /^[a-zA-Z0-9]+$/, 'is invalid'
        ],
        index: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [
            true, "Email is required."
        ],
        unique: true,
        validate: value => validator.isEmail(value)
    },
    balance: {
        type: String
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);