import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: {
        type: String,
        lowercase: true,
        required: [true, "Username is required."],
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email is required."],
        unique: true,
        validate: value => validator.isEmail(value)
    },
    income: String,
    password: String
}, {
    timestamps: true
});

const SALT_WORK_FACTOR = 10;

userSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods = {
    comparePassword: function (candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    }
}

export default mongoose.model('User', userSchema);