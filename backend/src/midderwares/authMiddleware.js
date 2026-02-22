import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = (req, res, next) => {
    try {
        //Take token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer && token

        if (!token) {
            return res
                .status(401)
                .json({ message: 'Can not find access token' });
        }

        //Checking valid token
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decodedUser) => {
                if (err) {
                    console.log(err);

                    return res
                        .status(403)
                        .json({
                            message: 'Invalid access token or time out token',
                        });
                }

                //Find user
                const user = await User.findById(decodedUser.userId).select(
                    '-hashedPassword',
                ); // Take user info except password

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                //Return user in request
                req.user = user;
                next();
            },
        );
    } catch (error) {
        console.log('Error authorized user', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
