const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { createToken } = require('../utils/jwtUtils');

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
})
const childSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
})


exports.registerParent = async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const parent = new User({ name, email, password });
        await parent.save();
        const token = createToken(parent._id, parent);
        res.status(201).json({
            message: "User registered successfully",
            token,
            parent
        })

    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }
        const token = createToken(user._id, user);
        res.status(200).json({
            message: "Login successful",
            token,
            user
        })

    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}


exports.addChildProfile = async (req, res) => {
    try {
        const parent = await User.findById(req.user);
        if (!parent) {
            return res.status(404).json({
                message: "Parent not found"
            })
        }
        const { name, email, password } = childSchema.parse(req.body);
        const childExists = parent.children.find((child) => child.email === email);
        if (childExists) {
            return res.status(400).json({
                error: "Child already exists"
            })
        }
        parent.children.push({
            name,
            email,
            password
        })
        await parent.save();
        res.status(201).json({
            message: "Child added successfully",
            children: parent.children
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }


}

exports.getChildProfiles = async (req, res) => {
    try {
        const parent = await User.findById(req.user);
        if (!parent) return res.status(404).json({ message: "Parent not found" });
        res.status(200).json({
            children: parent.children
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

