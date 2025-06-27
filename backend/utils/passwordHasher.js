const bcrypt = require('bcryptjs');

const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Could not hash password');
    }
};

const comparePassword = async (plainPassword, hashedPassword) => {
    // --- DEBUG LOGS START ---
    console.log('--- Inside comparePassword function ---'); // DEBUG LOG
    console.log('Plain password input (to bcrypt):', plainPassword); // DEBUG LOG
    console.log('Hashed password input (to bcrypt):', hashedPassword); // DEBUG LOG
    // --- DEBUG LOGS END ---
    try {
        const result = await bcrypt.compare(plainPassword, hashedPassword);
        // --- DEBUG LOG ---
        console.log('bcrypt.compare final result:', result); // DEBUG LOG
        // --- DEBUG LOG END ---
        return result;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Could not compare password');
    }
};

module.exports = {
    hashPassword,
    comparePassword
};