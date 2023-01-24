// All Requires
const { poSettingController,
    createPurchaseOrderController,
    updatePurchaseOrderController,
    updatePOStatusController,
    createReceivingController,
    createPOTRKDetailsController,
    createPOActivityController,
    createPOInvoiceController,
    createMFGDOCController,
    createPOStatusController,
    updatePOStatusPublicController,
    poSendToVendorController,
    createPORejectReasonController,
    deletePOInvoiceController,
    updatePOInvoiceController,
    updatePOMFGDOCController,
    deletePOMFGDOCController
} = require("../../controllers");


// PO Mutation Start
module.exports = {
    // PO SETTING Mutation
    poSetting: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await poSettingController(args.data, db, user, isAuth, TENANTID);
    },
    // PO STATUS Mutation
    createPOStatus: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createPOStatusController(args.data, db, user, isAuth, TENANTID);
    },
    // Create PO Mutation
    createPurchaseOrder: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createPurchaseOrderController(args.data, db, user, isAuth, TENANTID);
    },
    // Update PO Mutation
    updatePurchaseOrder: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updatePurchaseOrderController(args.data, db, user, isAuth, TENANTID);
    },
    // Update PO Status Mutation
    updatePOStatus: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updatePOStatusController(args.data, db, user, isAuth, TENANTID);
    },
    // PO Send To Vendor
    poSendToVendor: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await poSendToVendorController(args.data, db, user, isAuth, TENANTID);
    },
    // Update PO Status Mutation
    updatePOStatusPublic: async (root, args, { db, TENANTID, ip, headers }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Send to Controller
        return await updatePOStatusPublicController(args.data, db, TENANTID, ip, headers);
    },
    // Create Receiving Mutation
    createReceiving: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createReceivingController(args.data, db, user, isAuth, TENANTID);
    },
    // Create PO TRK 
    createPOTRKDetails: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createPOTRKDetailsController(args.data, db, user, isAuth, TENANTID);
    },
    // Create PO Activity 
    createPOActivity: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createPOActivityController(args.data, db, user, isAuth, TENANTID);
    },
    // Create PO Invoice 
    createPOInvoice: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createPOInvoiceController(args.data, db, user, isAuth, TENANTID);
    },
    // Update PO Invoice 
    updatePOInvoice: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updatePOInvoiceController(args.data, db, user, isAuth, TENANTID);
    },
    // Create PO MFG DOC
    createMFGDOC: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createMFGDOCController(args.data, db, user, isAuth, TENANTID);
    },
    // Create PO Reject Reason
    createPORejectReason: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createPORejectReasonController(args.data, db, user, isAuth, TENANTID);
    },
    // Delete PO Invoice
    deletePOInvoice: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await deletePOInvoiceController(args.data, db, user, isAuth, TENANTID);
    },
    // Update PO MFG DOC 
    updatePOMFGDOC: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updatePOMFGDOCController(args.data, db, user, isAuth, TENANTID);
    },
    // Delete PO MFG DOC
    deletePOMFGDOC: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await deletePOMFGDOCController(args.data, db, user, isAuth, TENANTID);
    },


}
