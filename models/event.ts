import mongoose, { models, Schema } from "mongoose";
import EventNames from "./eventNames";
const eventSchema: Schema = new Schema({
    name: {
        type: Schema.Types.ObjectId,
        ref: 'EventNames',
        required: true,
    },
    endDate: {
        type: Date,
    },
    eventDescription: {
        type: String,
        default: "",
    },
    color: {
        type: String,
    }
    

}, {timestamps: true}
);

const Event = models.Event || mongoose.model("Event", eventSchema); 
export default Event;