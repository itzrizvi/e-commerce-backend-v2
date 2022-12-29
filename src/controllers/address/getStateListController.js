// All Requires
const { getStateList } = require("../../helpers/addressHelper");
const { singleResponse } = require("../../utils/response");

// GET ATTR CONTROLLER
module.exports = async (db, args, TENANTID) => {
  const data = await getStateList(db, args, TENANTID);

  return singleResponse(data);
};
