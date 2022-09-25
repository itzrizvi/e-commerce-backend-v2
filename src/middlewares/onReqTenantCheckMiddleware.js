
const onReqTenantCheck = async (req, res, next) => {

    const TENANTID = req.get('TENANTID') || '';

    if (!TENANTID) {
        req.TENANTID = null;
        return next();
    }

    req.TENANTID = TENANTID;

    return next();
}



module.exports = onReqTenantCheck;