import { registerUserService, loginUserService } from "./auth.service.js";

export const registerUser = async (req,res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await registerUserService(
            name,
            email,
            password
        );

        return res.status(201).json({
            user
        });

        
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email?.trim() || !password){
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const result = await loginUserService(
            email,
            password
        );

        return res.status(200).json(result);
        
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

export const getProfile = async (req,res) => {
    return res.status(200).json({
        message: "Protected ROute Accessed",
        user: req.user,
    });
};