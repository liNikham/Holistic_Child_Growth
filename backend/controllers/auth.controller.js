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

exports.googleAuth = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ message: "Code not provided" });
        }

        console.log("Code received:", code);

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenResponse.json();
        console.log('OAuth tokens received:', tokens);

        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', tokens);
            return res.status(400).json({ 
                message: 'Failed to exchange authorization code for tokens' 
            });
        }

        // Get user info with access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const userInfo = await userInfoResponse.json();
        console.log('User info retrieved:', userInfo);

        if (!userInfoResponse.ok) {
            console.error('User info retrieval failed:', userInfo);
            return res.status(400).json({ 
                message: 'Failed to retrieve user information' 
            });
        }
  
        let user = await User.findOne({ email: userInfo.email });
        if (!user) {
            // Create a new user in your database
            const newUser = new User({
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                password: Math.random().toString(36).slice(-8) // Generate a random password
            });
            user = await newUser.save();
            console.log('New user created:', user._id);
        } else {
            if (user.picture !== userInfo.picture) {
                user.picture = userInfo.picture;
                await user.save();
            }
            console.log('Existing user logged in:', user._id);
        }
  
        const token = createToken(user._id, user);
        
        // Set cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });
        
        // Also set a non-httpOnly cookie with user's basic info for UI display
        const userInfo_safe = {
            name: user.name,
            email: user.email,
            picture: user.picture
        };
        
        res.cookie('user_info', JSON.stringify(userInfo_safe), {
            httpOnly: false, // This allows JavaScript to read this cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });
  
        // Perform actual redirect to dashboard
        // Check if a specific redirect URL was requested in the original OAuth request
        const redirectTo = req.query.state ? 
            JSON.parse(decodeURIComponent(req.query.state)).redirectUrl || 'http://localhost:5173/dashboard' : 
            'http://localhost:5173/dashboard';
            
        // Redirect the user to the dashboard or specified redirect URL
        return res.redirect(redirectTo);

    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(500).json({ error: error.message });
    }
}

