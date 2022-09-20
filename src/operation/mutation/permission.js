// All Requires




// Permission Mutation
module.exports = {
    createPermission: async (root, args, { db, user, isAuth }, info) => {
        console.log(args);
    }
}