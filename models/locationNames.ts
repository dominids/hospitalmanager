import mongoose, { models, Schema } from "mongoose";
const locationNamesSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    

}
);

const LocationNames = models.LocationNames || mongoose.model("LocationNames", locationNamesSchema); 
export default LocationNames;