const { gql } = require("apollo-server-express");


module.exports = gql`

# Category Based Input and Queries ###############################################
##################################################################################

input CategoryCreateInput {
    categoryName:String!
    categoryDescription:JSON
    categoryParentId:UUID
    categoryMetaTagTitle:String
    categoryMetaTagDescription:JSON
    categoryMetaTagKeywords:JSON
    categorySortOrder:Int
    categoryStatus:Boolean
    isFeatured:Boolean
}

type SubSubCategory {
    cat_id:UUID
    cat_name:String
    cat_slug:String
    cat_description:JSON
    cat_meta_tag_title:String
    cat_meta_tag_description:JSON
    cat_meta_tag_keywords:JSON
    image:String
    cat_sort_order:Int
    cat_status:Boolean
    is_featured:Boolean
    tenant_id:String
    cat_parent_id:UUID
}

type SubCategory {
    cat_id:UUID
    cat_name:String
    cat_slug:String
    cat_description:JSON
    cat_meta_tag_title:String
    cat_meta_tag_description:JSON
    cat_meta_tag_keywords:JSON
    image:String
    cat_sort_order:Int
    cat_status:Boolean
    is_featured:Boolean
    tenant_id:String
    cat_parent_id:UUID
    subsubcategories:[SubSubCategory]
}

type Category {
    cat_id:UUID!
    cat_name:String!
    cat_slug:String!
    cat_description:JSON
    cat_meta_tag_title:String
    cat_meta_tag_description:JSON
    cat_meta_tag_keywords:JSON
    image:String
    cat_sort_order:Int
    cat_status:Boolean
    is_featured:Boolean
    tenant_id:String
    cat_parent_id:UUID
    subcategories:[SubCategory]
}

type GetCategories {
    message:String
    status:Boolean
    tenant_id:String
    categories: [Category]
}

input GetSingleCategoryInput {
    cat_id:UUID
}

type GetSingleCategoryOutput {
    message:String
    status:Boolean
    tenant_id:String
    category:Category
}

type GetFeaturedCategories {
    message:String
    status:Boolean
    tenant_id:String
    categories: [Category]
}

input UpdateCategoryInput {
    cat_id:UUID!
    cat_name:String
    cat_description:JSON
    cat_meta_tag_title:String
    cat_meta_tag_description:JSON
    cat_meta_tag_keywords:JSON
    cat_status:Boolean
    cat_parent_id:UUID
    is_featured:Boolean
    cat_sort_order:Int
    mark_as_main_category:Boolean
}



extend type Mutation {
    createCategory(data: CategoryCreateInput, file:Upload): CommonOutput!
    updateCategory(data: UpdateCategoryInput, file:Upload): CommonOutput!
}

extend type Query {
    getAllCategories: GetCategories!
    getSingleCategory(query: GetSingleCategoryInput): GetSingleCategoryOutput!
    getParentCategories:GetCategories!
    getParentChildCategories:GetCategories!
    getFeaturedCategories: GetFeaturedCategories!
}


`;