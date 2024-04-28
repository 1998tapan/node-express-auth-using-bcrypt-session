const bcrypt = require("bcrypt");

const genHash = async (plainPw) => {
    const salt = await bcrypt.genSalt(12);
    console.log("Salt", salt);
    const hash = await bcrypt.hash(plainPw, salt);
    console.log("Hash", hash);
    return hash;
}

const login = async (plainPw, hashPw) => {
    return await bcrypt.compare(plainPw, hashPw);
}

const main = async () => {
    const plainPw = "monkey";
    const hashPw = await genHash(plainPw);
    const results = await login(plainPw, hashPw);
    console.log(results);

}

main();