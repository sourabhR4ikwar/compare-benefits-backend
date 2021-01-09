const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    website: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: 'https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg'
    },
    no_of_employees: {
      type: String
    },
    funding_stage: {
      type: String,
      default: 'Unknown'
    },
    industry:  {
      type: String
    },
    benefits: {
      health_insurance: {
        type: Boolean,
        default: false
      },
      gym_membership: {
        type: Boolean,
        default: false
      },
      free_doctor_on_call: {
        type: Boolean,
        default: false
      },
      number_of_paid_leaves: {
        type: String,
        default: 'Not Unlimited'
      },
      flexible_work_timings: {
        type: Boolean,
        default: false
      },
      remote_work_friendly: {
        type: Boolean,
        default: false
      },
      health_insurance_data : {
        sum_insured: {
          type: Boolean,
          default: false
        },
        family_covered: {
          type: Boolean,
          default: false
        },
        parents_covered: {
          type: Boolean,
          default: false
        },
        maternity_covered: {
          type: Boolean,
          default: false
        },
      }

    }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
