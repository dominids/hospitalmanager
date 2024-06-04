import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ProviderNamesSchema from "../../../../models/providerNames";
import Appliance from "../../../../models/appliance";

export async function GET() {
    try {
        await connectMongoDB();
        const appliance = await Appliance.find();
        return NextResponse.json({ appliance }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Error occured while fetching the data" }, { status: 500 });
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
        return NextResponse.json({ message: "Error occured while registering" }, { status: 500 });
    }
}