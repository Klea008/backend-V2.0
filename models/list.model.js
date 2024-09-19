import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     visibility: { type: String, required: true, default: 'private', enum: ['private', 'public'] },
     name: { type: String, required: true },
     books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
}, { timestamps: true });

const List = mongoose.model("List", listSchema);

export { List }