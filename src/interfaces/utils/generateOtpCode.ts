import otpGenerator from 'otp-generator';

export const otpCode: string = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        }); 
