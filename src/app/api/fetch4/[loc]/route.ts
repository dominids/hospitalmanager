import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Appliance from "../../../../../models/appliance";

export async function GET(req, { params }) {
    try {
        const {loc} = params
        await connectMongoDB();
        console.log(loc);
        const appliance = await Appliance.find({location: loc}).select('appliance inventoryNumber model event notes');
        console.log(appliance);
        return NextResponse.json({ appliance }, { status: 201 });

    } catch (error) {
        console.error("Error fetching appliances:", error.message);
        console.error("Error stack:", error.stack);
        throw error;
    }
}
export async function POST(req) {
    try {
        const { appliance,
            inventoryNumber,
            serialNumber,
            manufacturer,
            provider,
            model,
            location,
            buyDate,
            guaranteeDate,
            reviewDate,
            worth,
            notes,
            event } = await req.json();

        await connectMongoDB();
        await Appliance.create({
            appliance,
            inventoryNumber,
            serialNumber,
            manufacturer,
            provider,
            model,
            location,
            buyDate,
            guaranteeDate,
            reviewDate,
            worth,
            notes,
            event
        })

        return NextResponse.json({ message: `${appliance} registered in category` }, { status: 201 });
    } catch (error) {
        throw error;
        return NextResponse.json({ message: "Error occured while registering" }, { status: 500 });
    }
}