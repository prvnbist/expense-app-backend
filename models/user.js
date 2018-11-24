import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: String,
    gender: String,
    email:String,
    balance: String,
    password: String,
}, {
    timestamps: true
});

userSchema.path('email').validate( async value => {
    try {
        const count = await mongoose.model('User').countDocuments({ email: value }).exec();
        return !count;
    }
    catch (err) {
        throw err;
    }
    }, 'Email already exists.');

userSchema.path('username').validate( async value => {
    try {
        const count = await mongoose.model('User').countDocuments({ username: value }).exec();
        return !count;
    }
    catch (err) {
        throw err;
    }
    }, 'Username already exists.');

const User = mongoose.model('User', userSchema);
export default User;