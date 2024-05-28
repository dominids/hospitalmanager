import mongoose, { models, Schema } from "mongoose";
const applianceNamesSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    }
}
);

const ApplianceNames = models.ApplianceNames || mongoose.model("ApplianceNames", applianceNamesSchema); 
export default ApplianceNames;