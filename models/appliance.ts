import mongoose, { Schema, models } from 'mongoose';
import ApplienceNames from './applianceNames';
import ManufacturerNames from './manufacturersNames';
import ProviderNamesSchema from './providerNames';
import LocationSchema from './locationNames';
import Event from './event';

const applianceSchema = new Schema({
    appliance: {
        type: Schema.Types.ObjectId, // Use ObjectId if this is a reference
        ref: 'ApplienceNames',       // Reference the model name
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
        type: Schema.Types.ObjectId, // Use ObjectId if this is a reference
        ref: 'ManufacturerNames',    // Reference the model name
        required: true,
    },
    provider: {
        type: Schema.Types.ObjectId, // Use ObjectId if this is a reference
        ref: 'ProviderNames',        // Reference the model name
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    location: {
        type: Schema.Types.ObjectId, // Use ObjectId if this is a reference
        ref: 'LocationNames',        // Reference the model name
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
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }
}, { timestamps: true });

const Appliance = models.Appliance || mongoose.model('Appliance', applianceSchema);
export default Appliance;
