const { getAllRoles } = require("../../helpers/roleHelper");
const { getAllRoleRequest } = require("../../requests/roleRequests");
const { groupResponse, singleResponse } = require("../../utils/response");



//
module.exports = async (req, db, user, isAuth) => {
    //
    const validate = await getAllRoleRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    const data = await getAllRoles(req, db, user, isAuth);



    return groupResponse(data);
}