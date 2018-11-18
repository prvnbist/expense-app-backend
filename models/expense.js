import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    spentOn: String,
    userId: String,
    category: String,
    amount: String,
    description: String,
    type: String
}, {
    timestamps: true
});

export default mongoose.model('Expense', expenseSchema);