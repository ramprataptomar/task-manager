const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate jwt token
const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if(userExist){
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine user role
        let role = 'user';
        if(adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN){
            role = 'admin';
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // check if user exist or not
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid email or password'});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // console.log(user._id);
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        });
    }
    catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// @desc   Get user profile
// @route  GET /api/auth/profile    
// @access Private
const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    }
    catch(error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// @desc   Update user profile
// @route  PUT /api/auth/update
// @access Private
const updateUserProfile = async (req, res) => {
    try {
        console.log(req.user._id);
        
        const user = await User.findById(req.user._id);
        console.log(user);

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password && req.body.password.trim() !== ""){
            user.password = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10));
        }

        const updatedUser = await user.save();

        res.json(updatedUser);
        // res.json({
        //     _id: updatedUser._id,
        //     name: updatedUser.name,
        //     email: updatedUser.email,
        //     role: updatedUser.role,
        // });
    }
    catch(error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };