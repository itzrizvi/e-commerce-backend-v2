const { getAllStaff } = require("../../helpers/staffHelper");
const { groupResponse } = require("../../utils/response");



// GET STUFF CONTROLLER
module.exports = async (db, user, isAuth) => {
    const data = await getAllStaff(db, user, isAuth);

    return groupResponse(data);
}