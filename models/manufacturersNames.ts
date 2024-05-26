import mongoose, { models, Schema } from "mongoose";
const manufacturerNamesSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    

}
);

const ManufacturerNames = models.ManufacturerNames || mongoose.model("ManufacturerNames", manufacturerNamesSchema); 
export default ManufacturerNames;