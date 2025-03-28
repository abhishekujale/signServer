const mongoose = require("mongoose");

// const { Schema } = mongoose()
const Schema = mongoose();
export const UsersSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: { type: string, required: true }
})


// export mongoose.model("User", UsersSchema);
