import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TIME_OUT = '15m'; //usually <= 15m
const REFRESH_TOKEN_TIME_OUT = 15 * 24 * 60 * 60 * 1000; //15 days

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message:
                    'Can not miss username, password, email, first name or last name field',
            });
        }

        // Checking if user is already existed
        const duplicate = await User.findOne({ username });

        if (duplicate) {
            return res.status(409).json({ message: 'User already existed' });
        }

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10); //10 salt rounds

        // Create new User
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });

        //return
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error calling signUp', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signIn = async (req, res) => {
    try {
        // Take inputs
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: 'Can not miss username or password field' });
        }

        // Check db hashedPassword with input password
        const user = await User.findOne({ username });

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.hashedPassword,
        );

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }

        //Create accessToken with JWT if matches
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_TIME_OUT,
            },
        );

        //Create refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        //Create new session to store refressh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TIME_OUT),
        });

        // return refresh token to client through cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Can not be accessed by JS
            secure: true, //Only send through https
            sameSite: 'none', //backend, frontend separate deployment
            maxAge: REFRESH_TOKEN_TIME_OUT,
        });

        // return access token in response
        return res.status(200).json({
            message: `User ${user.displayName} logged in successfully`,
            accessToken,
        });
    } catch (error) {
        console.log('Error calling signIn', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signOut = async (req, res) => {
    try {
        // Take refresh token from cookie
        const token = req.cookies?.refreshToken;

        if (token) {
            // Delete refresh token in session
            await Session.deleteOne({ refreshToken: token });

            // Delete cookie
            res.clearCookie('refreshToken');
        }

        return res.sendStatus(204);
    } catch (error) {
        console.log('Error calling signOut', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Create access token using refresh token
export const refreshToken = async (req, res) => {
    try {
        // Take refresh token from cookie
        const token = req.cookies?.refreshToken;
        if (!token)
            return res.status(401).json({ message: 'Token do not exist' });

        // Compare refresh token in db
        const session = await Session.findOne({ refreshToken: token });

        if (!session) {
            return res
                .status(403)
                .json({ message: 'Invalid token or time out' });
        }

        // Check if the refresh token time out or not
        if (session.expiresAt < new Date()) {
            return res.status(403).json({ message: 'Time out token' });
        }

        // Create new access token
        const accessToken = jwt.sign(
            {
                userId: session.userId,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TIME_OUT },
        );

        // return
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error calling refresh token', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
