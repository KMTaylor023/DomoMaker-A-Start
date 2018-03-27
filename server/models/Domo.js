const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

const naturesDict = { Lonely: 0, Brave: 1, Adamant: 2, Naughty: 3,
  Bold: 4, Docile: 5, Relaxed: 6, Impish: 7,
  Lax: 8, Timid: 9, Hasty: 10, Serious: 11,
  Jolly: 12, Naive: 13, Modest: 14, Mild: 15,
  Quiet: 16, Bashful: 17, Rash: 18, Calm: 19,
  Gentle: 20, Sassy: 21, Careful: 22, Quirky: 23 };

const natureKeys = Object.keys(naturesDict);

let DomoModel = {};

const checkNature = (nature) => naturesDict[nature];

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  nature: {
    type: Number,
    min: 0,
    max: 23,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age nature').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
module.exports.checkNature = checkNature;
module.exports.natures = natureKeys;

