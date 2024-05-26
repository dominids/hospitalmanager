import mongoose, { models, Schema } from "mongoose";
const eventNamesSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    

}
);

const EventNames = models.EventNames || mongoose.model("EventNames", eventNamesSchema); 
export default EventNames;