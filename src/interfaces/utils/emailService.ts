import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

export enum EmailType {
    OTP = 'OTP',
    INVITE = 'INVITE',
    FORGOTPASSWORD = "FORGOTPASSWORD"
}


const emailTemplates = {
    [EmailType.OTP]: (data: {otp: string}) => ({
        subject: 'Your OTP Code',
        text: `Your OTP code is ${data.otp}. It is valid for 10 minutes.`,
        html: `<p>Your OTP code is <strong>${data.otp}</strong>. It is valid for 1 minutes.</p>`,
    }),

    [EmailType.INVITE]: (data: {sender: string, temeName: string}) => ({
        subject: 'You Have Been Invited to a Team!',
        text: `${data.sender} has invited you to join the team "${"data.teamName"}". Click the link below to accept the invitation.`,
        html: `<p><strong>${data.sender}</strong> has invited you to join the team "<strong>${"data.teamName"}</strong>".</p>
               <p>Click the link below to accept:</p>
               <a href="https://yourapp.com/invite">Accept Invitation</a>`,
    }),

    [EmailType.FORGOTPASSWORD]: (data: { resetLink: string }) => ({
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link below to reset your password: ${data.resetLink}. If you did not request this, please ignore this email.`,
        html: `<p>You requested a password reset.</p>
               <p>Click the link below to reset your password:</p>
               <a href="${data.resetLink}" target="_blank">Reset Password</a>
               <p>If you did not request this, please ignore this email.</p>`,
    })
}

export const sendEmail = async (to: string, type: EmailType, data: any) => {
    try{
        const template = emailTemplates[type](data);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: template.subject,
            text: template.text,
            html: template.html,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent: ', info.response);
        return info;
    }catch(error: any){
        console.error('Error sending email: ', error);
        throw error;
    }
}