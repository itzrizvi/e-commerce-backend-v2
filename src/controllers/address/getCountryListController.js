// All Requires
const { getCountryList } = require("../../helpers/addressHelper");
const { singleResponse } = require("../../utils/response");

// GET ATTR CONTROLLER
module.exports = async (db, TENANTID) => {
  const data = await getCountryList(db, TENANTID);

  return singleResponse(data);
};
