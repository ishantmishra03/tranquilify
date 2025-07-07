import User from '../models/user.models.js';

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");

        if(!user){
            res.status(404).json({success: false, message : "User not found"});
        }

        res.status(200).json({success: true, user});
    } catch (error) {
        console.error('Error fetching userData:', error);
        res.status(500).json({ success: false, message: 'Server error fetching latest habits' });
    }
}