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


    [EmailType.INVITE]: (data: { sender: string, teamName: string, inviteLink: string }) => {
        console.log("checking the inviteLink in the emailService", data.inviteLink)
        return{

        subject: "You're Invited to Join TeamSync!",
        text: `${data.sender} has invited you to join the team "${data.teamName}". Click the link below to accept the invitation: ${data.inviteLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    
                <h2 style="color: #1A1A1A; text-align: center;">${data.sender} invited you to join them in TeamSync</h2>
                <p style="color: #4A4A4A; text-align: center;">
                    Start collaborating and tracking your work with ${data.sender} and the "${data.teamName}" team. 
                    Share updates, manage projects, and work together efficiently.
                </p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${data.inviteLink}" 
                       style="background-color: #0052CC; color: white; text-decoration: none; 
                              padding: 12px 24px; border-radius: 6px; font-size: 16px;">
                        Accept Invite
                    </a>
                </div>
                <p style="color: #6A6A6A; font-size: 14px; margin-top: 30px; text-align: center;">
                    <strong>What is TeamSync?</strong> A powerful platform for seamless team collaboration and project management. 
                    Organize your tasks, track progress, and work smarter. 
                    <a href="https://your-app-url.com/learn-more" style="color: #0052CC; text-decoration: none;">Learn more</a>.
                </p>
            </div>
        `,
    }},
    

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




            // <div style="text-align: center;">
            //         <img src="https://your-logo-url.com/teamsync-logo.png" alt="TeamSync Logo" style="width: 120px; margin-bottom: 20px;">
            //     </div>