var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret_key = process.env.JWT_SECRET;  

const generateToken = async (id) => {
    try {
        const token = jwt.sign({ id }, secret_key, {
            expiresIn: "30d"  // Set token expiration
        });
        return token;  // Return the generated token
    } catch (error) {
        console.error("Error generating token:", error);  // Log any errors
        throw new Error("Token generation failed");
    }
}

module.exports = generateToken;
