import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId}, process.env.JWT_SECRET, {
        expiresIn: '7d' // 1 day
    })

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        sameSite: 'Strict', // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return token
}