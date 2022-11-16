const { gql } = require("apollo-server-express");


module.exports = gql`

# Purchase Order Setting Based Input and Types ###########
##########################################################

input POSettingInput {
    po_prefix:String!
    po_startfrom:Int
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    poSetting(data:POSettingInput):CommonOutput!
}

# extend type Query {

# }


`;