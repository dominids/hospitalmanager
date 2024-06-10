import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Appliance from "../../../../models/appliance";
export async function PUT(req) {
    try {
        const { id, name, endDate, eventDescription } = await req.json();
        console.log(id, name, endDate, eventDescription);
        var updatedAppliance;
        if (eventDescription && endDate) {
            updatedAppliance = await Appliance.findByIdAndUpdate(
                id,
                {
                    event: {
                        name: name,
                        endDate: new Date(endDate),
                        eventDescription: eventDescription,
                    }
                },
                { new: true } // This option returns the modified document rather than the original.
            );
        }
        else {
            updatedAppliance = await Appliance.findByIdAndUpdate(
                id,
                {
                    event: {
                        name: name,
                        eventDescription: eventDescription,
                    }
                },
                { new: true } // This option returns the modified document rather than the original.
            );
        }
        if (!updatedAppliance) {
            return NextResponse.json({ message: "Appliance not found" }, { status: 404 });
        }
        await connectMongoDB();
        console.log(`Event registered`);
        console.log(id, name, endDate, eventDescription);

        return NextResponse.json({ message: "Event registered in category" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error occured while registering" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();
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