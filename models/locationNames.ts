import mongoose, { models, Schema } from "mongoose";
const locationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    

}
);

const LocationSchema = models.LocationSchema || mongoose.model("LocationSchema", locationSchema); 
export default LocationSchema;