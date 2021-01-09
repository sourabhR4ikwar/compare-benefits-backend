const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Company {
        _id: ID!
        name: String!
        website: String
        imageUrl: String
        no_of_employees: String
        funding_stage: String
        industry: String
        benefits: Benefits
        createdAt: String!
        updatedAt: String!
    }

    type Benefits {
        health_insurance: Boolean
        gym_membership: Boolean
        free_doctor_on_call: Boolean
        number_of_paid_leaves: String
        flexible_work_timings: Boolean
        remote_work_friendly: Boolean
        health_insurance_data: HealthInsuranceData
    }

    type HealthInsuranceData {
        sum_insured: Boolean
        family_covered: Boolean
        parents_covered: Boolean
        maternity_covered: Boolean
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        Company: String!
    }

    type CompanyData {
        companies: [Company!]!
        totalCompanies: Int!
    }

    input UserInputData {
        email: String!
        name: String!
    }
    input HealthInsuranceDataInput {
        sum_insured: Boolean
        family_covered: Boolean
        parents_covered: Boolean
        maternity_covered: Boolean
    }
    input BenefitsInput {
        health_insurance: Boolean
        gym_membership: Boolean
        free_doctor_on_call: Boolean
        number_of_paid_leaves: String
        flexible_work_timings: Boolean
        remote_work_friendly: Boolean
        health_insurance_data: HealthInsuranceDataInput
    }
    input CompanyInputData {
        name: String!
        website: String
        imageUrl: String
        no_of_employees: String
        funding_stage: String
        industry: String
        benefits: BenefitsInput
    }

    type RootQuery {
        companies(page: Int): CompanyData!
        competitors(id: ID!, page: Int!, limit: Int): CompanyData!
        company(id: ID!): Company!
        user: User!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createCompany(companyInput: CompanyInputData): Company!
        updateCompany(id: ID!, companyInput: CompanyInputData): Company!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
