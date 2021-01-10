const validator = require('validator');

const User = require('../models/user');
const Company = require('../models/company');

module.exports = {

  createUser: async function({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });

    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const user = new User({
      email: userInput.email,
      name: userInput.name,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  user: async function(args, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!');
      error.code = 404;
      throw error;
    }
    return { ...user._doc, _id: user._id.toString() };
  },
  
  createCompany: async function({ companyInput, userId }, req) {
    const errors = [];
    if (validator.isEmpty(companyInput.name))
    {
      errors.push({ message: 'Company Name is invalid.' });
    }
    if (validator.isEmpty(companyInput.no_of_employees)) {
      errors.push({ message: 'No of employees is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }
    let newCompanyData = {}
    Object.keys(companyInput).map(key => {
      newCompanyData[key] = companyInput[key]
    })

    const company = new Company(newCompanyData);
    const createdCompany = await company.save();
    user.company = createdCompany;
    await user.save();
    return {
      ...createdCompany._doc,
      _id: createdCompany._id.toString(),
      createdAt: createdCompany.createdAt.toISOString(),
      updatedAt: createdCompany.updatedAt.toISOString()
    };
  },



  updateCompany: async function({ id, companyInput }, req) {
    const company = await Company.findById(id);
    if (!company) {
      const error = new Error('No company found!');
      error.code = 404;
      throw error;
    }
    
    const errors = [];
    if (validator.isEmpty(companyInput.name))
    {
      errors.push({ message: 'Company Name is invalid.' });
    }
    if (validator.isEmpty(companyInput.no_of_employees)) {
      errors.push({ message: 'No of employees is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    Object.keys(companyInput).map(key => {
      company[key] = companyInput[key]
    })
    const updatedCompany = await company.save();
    return {
      ...updatedCompany._doc,
      _id: updatedCompany._id.toString(),
      createdAt: updatedCompany.createdAt.toISOString(),
      updatedAt: updatedCompany.updatedAt.toISOString()
    };
  },
  
  competitors: async function({ id, page, limit }, req) {
    if (!page) {
      page = 1;
    }
    const perPage = limit || 10;
    const currentCompany = await Company.findById(id);
    const totalCompanies = await Company.find({ industry: currentCompany.industry, no_of_employees: currentCompany.no_of_employees }).count();
    const companies = await Company.find({ industry: currentCompany.industry, no_of_employees: currentCompany.no_of_employees, _id: {$ne: currentCompany._id }})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    return {
      companies: companies.map(comp => {
        return {
          ...comp._doc,
          _id: comp._id.toString(),
          createdAt: comp.createdAt.toISOString(),
          updatedAt: comp.updatedAt.toISOString()
        };
      }),
      totalCompanies: totalCompanies,
      page: page
    };
  },

  companies: async function({ page, limit }, req) {
    if (!page) {
      page = 1;
    }
    const perPage = limit || 12;
    const totalCompanies = await Company.find().countDocuments();
    const companies = await Company.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    return {
      companies: companies.map(comp => {
        return {
          ...comp._doc,
          _id: comp._id.toString(),
          createdAt: comp.createdAt.toISOString(),
          updatedAt: comp.updatedAt.toISOString()
        };
      }),
      totalCompanies: totalCompanies,
      page: page
    };
  },

  company: async function({ id }, req) {
    const company = await Company.findById(id);
    if (!company) {
      const error = new Error('No company found!');
      error.code = 404;
      throw error;
    }
    return {
      ...company._doc,
      _id: company._id.toString(),
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString()
    };
  }

};
