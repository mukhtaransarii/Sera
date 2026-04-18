import type { Request, Response } from 'express';
import User from '../models/user';
import { loginSchema, singupSchema } from '../validation/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// signup
export const signup = async (req: Request, res: Response) => {
  try {
    const result = singupSchema.safeParse(req.body);
    if(!result.success) return res.status(400).json({ success: false, message: "Invalid data", errors: result.error.issues });

    const { name, email, password } = result.data;
    const user = new User({name, email, password});
    await user.save();
    
    if(!user) return res.status(400).json({success: false, message: 'User not created'})
    
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,        // JS can't access → prevents XSS
      secure: false,         // true in production (HTTPS)
      sameSite: 'strict',    // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    .status(200).json({ success: true, message: 'user creates successfully', user});
  } catch (error:any) {
    return res.status(500).json({success: false, message: 'something went wrong', error: error.message})
  }
}

// login
export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if(!result.success) return res.status(400).json({ success: false, message: "Invalid data", errors: result.error.issues });
    
    const { email, password } = result.data;
    const user = await User.findOne({ email })
    if(!user) return res.status(400).json({success: false, message: 'User not exist'})
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({success: false, message: 'user password is incorrect'})
  
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,        // JS can't access → prevents XSS
      secure: false,         // true in production (HTTPS)
      sameSite: 'strict',    // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    .status(200).json({ success: true, message: 'user logged in successfully', user});

  } catch (error:any) {
    return res.status(500).json({success: false, message: 'something went wrong', error: error.message})
  }
}

// logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token').json({ success: true, message: 'Logged out successfully'});
};

// isAuth
export const isAuthme = (req: Request, res: Response) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, message: 'token is missing', loggedIn: false });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    if (!user) return res.status(401).json({ success: false, message: 'token is invalid', loggedIn: false });
  
    res.status(200).json({ success: true, message: 'token is valid', loggedIn: true, user });
  } catch {
    res.status(401).json({ success: false, message: 'token is invalid', loggedIn: false });
  }
};