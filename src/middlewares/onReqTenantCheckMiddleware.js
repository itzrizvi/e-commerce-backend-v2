
const onReqTenantCheck = async (req, res, next) => {

    const TENANT_ID = req.get('TENANT_ID') || '';

    if (!TENANT_ID) {
        req.TENANT_ID = null;
        return next();
    }

    req.TENANT_ID = TENANT_ID;

    return next();
}



module.exports = onReqTenantCheck;