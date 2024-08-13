export const sendToken = (user,statusCode, message, res)=>{
const token =user.getJWToken();
const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10);

const expiresDate = new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000);
const options = {
    expires: expiresDate,
    httpOnly: true,

};

res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    token,
    user,
});
};
