let getQuery = function (args) {
    return args.query ? args.query : {}
}

let getInput = function (args) {
    return args.input ? args.input : {}
}


exports = {
    Query: {
        user: (parent, args, { db }, info) => db.getUser(args, info)
    },
    Mutation: {
        createUser: (parent, args, { db }, info) => { db.createUser(args, info) }
    }
};