import mongoose, { Schema, models } from 'mongoose';



const applianceSchema = new Schema({
    appliance: {
        type: String,
        required: true,
    },
    inventoryNumber: {
        type: Number,
        required: true,
    },
    serialNumber: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
    },
    model: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    buyDate: {
        type: Date,
        required: true,
    },
    guaranteeDate: {
        type: Date,
        required: true,
    },
    reviewDate: {
        type: Date,
        required: true,
    },
    worth: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    event: {
        name: {
            type: String,
        },
        endDate: {
            type: Date,
        },
        eventDescription: {
            type: String,
        },
    }
}, { timestamps: true });

const Appliance = models.Appliance || mongoose.model('Appliance', applianceSchema);
export default Appliance;
