import mongoose, { models, Schema } from "mongoose";
const eventSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    endDate: {
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    eventDescription: {
        type: String,
        default: "",
    }
    

}, {timestamps: true}
);

const Event = models.Event || mongoose.model("Event", eventSchema); 
export default Event;