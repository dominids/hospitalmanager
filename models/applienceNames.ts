import mongoose, { models, Schema } from "mongoose";
const applienceNamesSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    }
}
);

const ApplienceNames = models.ApplienceNames || mongoose.model("ApplienceNames", applienceNamesSchema); 
export default ApplienceNames;