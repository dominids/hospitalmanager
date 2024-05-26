import mongoose, { models, Schema } from "mongoose";
import ApplienceNames from "./applienceNames";
import ManufacturerNames from "./manufacturersNames";
import ProviderNamesSchema from "./providerNames";
import LocationSchema from "./locationNames";
import { text } from "stream/consumers";
const applienceSchema: Schema = new Schema({
    inventoryNumber: {
        type: String,
        required: true,
    },
    serialNumber: {
        type: Date,
        required: true,
    },
    applience: {
        type: ApplienceNames,
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
    }


    

}, {timestamps: true}
);

const Applience = models.Applience || mongoose.model("Applience", applienceSchema); 
export default Applience;