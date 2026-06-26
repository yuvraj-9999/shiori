import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../config/env.js";

export const registerUserService = async (name,email,password) => {
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
};

export const loginUserService = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
        {
            userId: user._id,
        },
        env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token,
    };
};
