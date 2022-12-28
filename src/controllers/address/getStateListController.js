// All Requires
const { getStateList } = require("../../helpers/addressHelper");
const { singleResponse } = require("../../utils/response");

// GET ATTR CONTROLLER
module.exports = async (db, TENANTID) => {
  const data = await getStateList(db, TENANTID);

  return singleResponse(data);
};
