// controllers/borrowController.js
const User = require('../models/User');

exports.borrowMoney = async (req, res) => {
    const { amount } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update Purchase Power amount
        user.purchasePower += amount;

        // Calculate monthly repayments
        const interestRate = 0.08;
        const tenure = 12; // 12 months
        const monthlyRepayment = (amount + amount * interestRate) / tenure;

        await user.save();

        res.json({
            purchasePower: user.purchasePower,
            monthlyRepayment,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
