const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    userName: {
        type: String,
        require: [true, " Username should not be empty"]
    },
    password: {
        type: String,
        require: [true, " Password should not be empty"]
    }
})

userSchema.statics.findAndValidate = async function (userName, password) {
    const user = await User.findOne({ userName });
    if (!user) {
        return false;
    }
    const validPassword = await bcrypt.compare(password, user.password);

    return validPassword ? user : false;
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);;
    return next();
})

const User = model("User", userSchema);

module.exports = User;