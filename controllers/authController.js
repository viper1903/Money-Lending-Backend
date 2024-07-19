const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    const { phoneNumber, email, name, dob, monthlySalary, password } = req.body;

    // Validate user age and monthly salary
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 20 || monthlySalary < 25000) {
        return res.status(400).json({ msg: 'Age must be above 20 and monthly salary must be 25k or more' });
    }

    try {
        // Create and save new user
        const user = new User({
            phoneNumber,
            email,
            name,
            dob,
            monthlySalary,
            password,
            status: 'Approved',
        });
        await user.save();

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    msg: 'Registered Successfully'
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    msg: 'Login Successfully'
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
