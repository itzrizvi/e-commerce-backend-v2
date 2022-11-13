const { gql } = require("apollo-server-express");


module.exports = gql`

    type CompanyInfo{
        id: Int
        name: String
        logo: String
        dark_logo:String
        fav_icon:String
        contact_address: String
        company_phones: [PhoneOutput]
        company_emails: [EmailOutput]
        company_socials: [SocialOutput]
        fax: String
        tenant_id: String
        createdAt: String
        updatedAt: String
    }

    input CompanyInfoInput{
        name: String!
        logo: Upload
        dark_logo: Upload
        fav_icon: Upload
        contact_address: String
        phone: [Phone]
        email: [Email]
        social:[Social]
        fax: String
    }

    type EmailOutput{
        id: Int
        email: String
        type: String
        tenant_id: String
        createdAt: String
        updatedAt: String
    }

    type PhoneOutput{
        id: Int
        phone: String
        type: String
        tenant_id: String
        createdAt: String
        updatedAt: String
    }

    input Phone{
        id: Int
        phone: String!
        type: String!
    }

    input Email{
        id: Int
        email: String!
        type: String!
    }

    input Social {
        id: Int
        social: String!
        type: String!
    }

    type SocialOutput{
        id: Int
        social: String
        type: String
        tenant_id: String
        createdAt: String
        updatedAt: String
    }

    type GetCompanyInfoOutput{
        message: String
        status: Boolean
        tenant_id: String
        data: CompanyInfo
    }

    extend type Mutation {
        companyInfo(data: CompanyInfoInput):CommonOutput!
    }

    extend type Query{
        getCompanyInfo: GetCompanyInfoOutput!
    }
`;