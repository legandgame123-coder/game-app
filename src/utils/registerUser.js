import axios from "axios";

const registerUser = async ({ fullName, email, phoneNumber, password }) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/users/register`,
            { fullName, email, phoneNumber, password }
        );
        return res.data; // optional: return something useful
    } catch (error) {
        console.error("Failed to register user:", error);
        throw error; // optional: re-throw for UI to handle
    }
};

const verifyOTP = async ({userId, emailOTP, smsOTP}) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/otp/verify`,
            { userId, emailOTP, smsOTP }
        );
        return res.data; // optional: return something useful
    } catch (error) {
        console.error("OTP is not correct or expired", error);
        throw error; // optional: re-throw for UI to handle
    }
}

export {
    registerUser,
    verifyOTP
}
