const jwt = require("jsonwebtoken");
// const config = require('./config');
const bcrypt = require("bcryptjs")

//To encrypt the password
const encryptPassword = password => new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            reject(err)
            return false
        }
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                reject(err)
                return false
            }
            resolve(hash)
            return true
        })
    })
})

//To compare password
const comparePassword = (password, hash) => new Promise(async (resolve, reject) => {
    try {
        const isMatch = await bcrypt.compare(password, hash)
        resolve(isMatch)
        return true
    } catch (err) {
        reject(err)
        return false
    }
})

//To Generate Jwt token
const getToken = payload => {
    const token = jwt.sign(payload.toJSON(), "secret", {
        expiresIn: 604800, // 1 Week
    })
    return token
}

//To verify Jwt token
const getPayload = token => {
    try {
        const payload = jwt.verify(token, "secret");
        // console.log(payload);
        return {
            loggedIn: true,
            payload
        };
    } catch (err) {
        // Add Err Message
        return {
            loggedIn: false
        }
    }
}

module.exports = {
    getToken,
    getPayload,
    encryptPassword,
    comparePassword
}