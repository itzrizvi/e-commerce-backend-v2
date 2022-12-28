const { gql } = require("apollo-server-express");


module.exports = gql`

# Category Based Input and Queries ###############################################
##################################################################################

input CategoryCreateInput {
    categoryName:String!
    categoryDescription:JSON
    categoryParentId:Int
    categoryMetaTagTitle:String
    categoryMetaTagDescription:JSON
    categoryMetaTagKeywords:JSON
    categorySortOrder:Int
    categoryStatus:Boolean
    isFeatured:Boolean
}

type SubSubCategory {
    id:Int
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
    cat_parent_id:Int
}

type SubCategory {
    id:Int
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
    cat_parent_id:Int
    subsubcategories:[SubSubCategory]
}

type Category {
    id:Int!
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
    cat_parent_id:Int
    subcategories:[SubCategory]
}

type GetCategories {
    message:String
    status:Boolean
    tenant_id:String
    categories: [Category]
}

input GetSingleCategoryInput {
    cat_id:Int
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
    data: [Category]
}

input UpdateCategoryInput {
    cat_id:Int!
    cat_name:String
    cat_description:JSON
    cat_meta_tag_title:String
    cat_meta_tag_description:JSON
    cat_meta_tag_keywords:JSON
    cat_status:Boolean
    cat_parent_id:Int
    is_featured:Boolean
    cat_sort_order:Int
    mark_as_main_category:Boolean
}

input GetProductByCategoryInput {
    cat_id:Int!
}

type GetProductByCategoryOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[ProductForList]

}

input GetProductByCategorySlugInput {
    category_slug:String!
}

type GetProductByCategorySlugOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[ProductForList]

}


type BreadCrumbCategories {
    id:Int
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
    cat_parent_id:Int
    parentCategory:BreadCrumbCategories
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

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
    getProductsByCategory(query: GetProductByCategoryInput):GetProductByCategoryOutput!
    getProductsByCategorySlug(query: GetProductByCategorySlugInput):GetProductByCategorySlugOutput!
}


`;