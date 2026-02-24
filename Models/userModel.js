import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name"]
    },
    email: {
        type: String,
        required: [true, "please enter email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please enter password"],
    },
    forgetToken: {
        type: String
    },
    forgetTokenExpire: {
        type: Date
    },
}, { timestamps: true })

const userModel = mongoose.model("user", userSchema)

export default userModel;