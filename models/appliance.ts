import mongoose, { models, Schema } from "mongoose";
import ApplienceNames from "./applianceNames";
import ManufacturerNames from "./manufacturersNames";
import ProviderNamesSchema from "./providerNames";
import LocationSchema from "./locationNames";
import Event from "./event";
const applianceSchema: Schema = new Schema({
    appliance: {
        type: ApplienceNames,
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
        type: ManufacturerNames,
        required: true,
    },
    provider: {
        type: ProviderNamesSchema,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    location: {
        type: LocationSchema,
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
    //dodaj obsługę zdjęć
    notes: {
        type: String
    },
    event: {
        type: Event
    }
}, { timestamps: true }
);

const Appliance = models.Appliance || mongoose.model("Appliance", applianceSchema);
export default Appliance;