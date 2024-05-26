import mongoose, { models, Schema } from "mongoose";
const providerNamesSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    

}
);

const ProviderNamesSchema = models.ProviderNamesSchema || mongoose.model("ProviderNamesSchema", providerNamesSchema); 
export default ProviderNamesSchema;