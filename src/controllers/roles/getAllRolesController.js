const { getAllRoles } = require("../../helpers/roleHelper");
const { groupResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (db, user, isAuth) => {
    const data = await getAllRoles(db, user, isAuth);

    return groupResponse(data);
}