const { gql } = require("apollo-server-express");


module.exports = gql`

# Quote Based Input and Types ############################
##########################################################

    type QuoteItem {
        id:Int
        quote_id:Int
        price:Float
        quantity:Float
        total_price:Float
        product:ProductForList
        createdBy:Int
        updatedBy:Int
        tenant_id:String
        createdAt:String
        updatedAt:String
    }

    type Quote {
        id:Int
        status:String
        grand_total:Float
        tenant_id:String
        createdAt:String
        updatedAt:String
        quoteitems:[QuoteItem]
        quotedby:Staff
    }

    type QuoteStatus {
        id:Int
        name:String
        slug:String
        description:String
        status:Boolean
        tenant_id:String
        createdAt:String
        updatedAt:String
        added_by:Staff
    }


    type SubmittedQuoteItem {
        id:Int
        submittedquote_id:Int
        price:Float
        quantity:Float
        total_price:Float
        product:ProductForList
        createdBy:Int
        updatedBy:Int
        tenant_id:String
        createdAt:String
        updatedAt:String
    }

    type SubmittedQuote {
        id:Int
        status:String
        grand_total:Float
        note:String
        tenant_id:String
        createdAt:String
        updatedAt:String
        submittedquoteitems:[SubmittedQuoteItem]
        quotedby:Staff
    }


    input AddToQuoteInput {
        product_id:Int!
        quantity:Int
    }

    type AddToQuoteOutput {
        message:String
        status:Boolean
        tenant_id:String
        id:Int
    }

    input QuoteItemDeleteInput {
        id:Int!
    }

    input SubmitQuoteInput {
        quote_id:Int!
        note:String
    }

    input QuoteSyncInput {
        products:JSON!
    }

    type GetQuoteListOutput {
        message:String
        status:Boolean
        tenant_id:String
        data:Quote
    }

    type GetSibmittedQuoteList {
        message:String
        tenant_id:String
        status:Boolean
        data:[SubmittedQuote]
    }

    input GetSingleSubmittedQuoteInput {
        id:Int!
    }

    type GetSingleSubmittedQuoteOutput {
        message:String
        tenant_id:String
        status:Boolean
        data:SubmittedQuote
    }
    
    input SubmittedQuoteUpdateInput {
        id:Int!
        note:String
        status:String
        products:JSON
    }

    input GetReviewedQuoteInput {
        id:String!
    }

    type GetReviewedQuoteOutput {
        message:String
        tenant_id:String
        status:Boolean
        data:SubmittedQuote
    }

    input SubmittedQuoteListInput {
        searchQuery:String
        statuses:[String]
        quoteEntryStartDate:String
        quoteEntryEndDate:String
        minAmount:Int
        maxAmount:Int
    }

    input createQuoteStatusInput {
        name:String!
        description:String!
        status:Boolean!
    }

    type GetQuoteStatusListOutput {
        message:String
        tenant_id:String
        status:Boolean
        data:[QuoteStatus]
    }

    # Extended QUERIES AND MUTATIONS ######################################
    #######################################################################

    extend type Mutation {
        addToQuote(data:AddToQuoteInput):AddToQuoteOutput!
        submitQuote(data:SubmitQuoteInput):CommonOutput!
        quoteSync(data:QuoteSyncInput):AddToQuoteOutput!
        quoteItemDelete(data:QuoteItemDeleteInput):CommonOutput!
        updateSubmittedQuote(data:SubmittedQuoteUpdateInput):CommonOutput!
        createQuoteStatus(data:createQuoteStatusInput):CommonOutput!
    }

    extend type Query {
        getQuoteList:GetQuoteListOutput!
        getSubmittedQuoteList(query:SubmittedQuoteListInput):GetSibmittedQuoteList!
        getSingleSubmittedQuote(query:GetSingleSubmittedQuoteInput):GetSingleSubmittedQuoteOutput!
        getReviewedQuote(query:GetReviewedQuoteInput):GetReviewedQuoteOutput!
        getQuoteStatusList:GetQuoteStatusListOutput!
    }


`;