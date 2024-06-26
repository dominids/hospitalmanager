import mongoose, { models, Schema } from "mongoose";
const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    }


}, {timestamps: true}
);

const User = models.User || mongoose.model("User", userSchema); 
export default User;