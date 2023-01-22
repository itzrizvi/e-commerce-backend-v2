const { getPurchaseOrderListController,
    getSinglePurchaseOrderController,
    viewPurchaseOrderPublicController,
    getPOTRKListController,
    getPOActivityListController,
    getPOInvoiceListController,
    getPOMFGDOCListController,
    getPOStatusListController,
    getPONumbersController,
    getPORejectReasonListController } = require("../../controllers");


// PO BASED QUERY
module.exports = {
    // PO LIST QUERIES
    getPurchaseOrderList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getPurchaseOrderListController(args.query, db, user, isAuth, TENANTID);
    },
    // SINGLE PO QUERIY
    getSinglePurchaseOrder: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSinglePurchaseOrderController(args.query, db, user, isAuth, TENANTID);
    },
    // View PO Public
    viewPurchaseOrderPublic: async (root, args, { db, TENANTID, ip, headers }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await viewPurchaseOrderPublicController(args.query, db, TENANTID, ip, headers);
    },
    // PO TRK LIST
    getPOTRKList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getPOTRKListController(args.query, db, user, isAuth, TENANTID);
    },
    // PO Activity LIST
    getPOActivityList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getPOActivityListController(args.query, db, user, isAuth, TENANTID);
    },
    // PO Invoice LIST
    getPOInvoiceList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getPOInvoiceListController(args.query, db, user, isAuth, TENANTID);
    },
    // PO MFG DOC LIST
    getPOMFGDOCList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getPOMFGDOCListController(args.query, db, user, isAuth, TENANTID);
    },
    // PO STATUS LIST
    getPOStatusList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getPOStatusListController(db, TENANTID);
    },
    // PO NUMBER LIST
    getPONumbers: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getPONumbersController(db, user, isAuth, TENANTID);
    },
    // PO REJECT REASON LIST
    getPORejectReasonList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getPORejectReasonListController(db, TENANTID);
    },

}