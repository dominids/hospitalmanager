import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Appliance from "../../../../../models/appliance";

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await connectMongoDB();

        const updatedAppliance = await Appliance.findByIdAndUpdate(
            id,
            { $unset: { event: "" } }, // Unset the event field
            { new: true }
        );

        if (!updatedAppliance) {
            return NextResponse.json({ message: "Appliance not found" }, { status: 404 });
        }

        console.log(`Event removed`);
        console.log(id);

        return NextResponse.json({ message: "Event removed from appliance", updatedAppliance }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error occurred while removing event" }, { status: 500 });
    }
}