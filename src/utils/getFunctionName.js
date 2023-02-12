const getFunctionName = (depth = 2) => (new Error()).stack.split("\n")[depth].trim().slice((new Error()).stack.split("\n")[depth].trim().lastIndexOf(" "), (new Error()).stack.split("\n")[depth].trim().lastIndexOf("(")).trim();


module.exports = {
    getFunctionName
}