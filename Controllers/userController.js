import userModel from "../Models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const user = await userModel.findOne({ email })

        if (user) {
            return res.status(201).json({ success: false, message: "user already registered!..." })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const data = await userModel.create({ name, email, password: hashedPassword })
        return res.status(200).json({ success: true, message: "user registered successfully!...", data })

    } catch (error) {
        return res.status(404).json({ success: false, message: error._message })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(201).json({ success: false, message: "user not registered!..." })
    }
    const verfiyPassword = await bcrypt.compare(password, user.password)

    if (!verfiyPassword) {
        return res.status(201).json({ success: false, message: "invalid credentials!..." })
    }
    const token = generateToken(user._id)
    return res.status(201).json({ success: true, message: "login Successfully", token, user })
}


export const forgetPassword = async (req, res) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(201).json({ success: false, message: "user not found" })
    }
    const resetToken = crypto.randomBytes(20).toString("hex")

    const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    user.forgetToken = hashToken
    user.forgetTokenExpire = Date.now() + 15 * 60 * 1000
    await user.save()

    // 4️⃣ Reset URL
    const resetUrl = `https://stunning-cranachan-c8c52d.netlify.app/reset-password/${resetToken}`;

    // 5️⃣ Email message
    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 15 minutes</p>
    `;
    const subject = "reset password"

    await sendEmail({
        email,
        subject,
        message
    });

    return res.status(201).json({ success: true, message: "reset link is send to your email accout " + email })

}

export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body
        const { token } = req.params

        if (!password) {
            return res.status(201).json({
                success: false,
                message: "Password is required"
            });
        }

        const hashToken = crypto.createHash("sha256").update(token).digest("hex")
        const user = await userModel.findOne({
            forgetToken: hashToken,
            forgetTokenExpire: {
                $gt: Date.now()
            }

        })
        if (!user) {
            return res.status(201).json({
                success: false,
                message: "Somthing went wrong please try again"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword
        user.forgetToken = undefined
        user.forgetTokenExpire = undefined

        await user.save()
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: error
        });

    }
}
