const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
    guidebanner: {
        type: String,
        required: true,
    },
    heading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});


const bannerModel = mongoose.model("guidebanner", bannerSchema);

module.exports = bannerModel;
