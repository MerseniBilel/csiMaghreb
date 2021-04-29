const mongoose = require('mongoose');

//create project model

const projectSchema = mongoose.Schema({
  projectName: {
    type: String,
    required:true
  },
  projectDesc: {
    type: String,
    required: true
  },
  projectOwner:{
    type: String,
    required: true
  },
  team:{
    type: [String], //mails of dev team who's going to participate into the project
    required: true // send notification to every participater // or mail
  },
  creationDate:{
    type: Date,
    default: Date.now
  }
});


module.exports = Project = mongoose.model('project',projectSchema);