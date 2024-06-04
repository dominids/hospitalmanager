import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Appliance from "../../../../models/appliance";

export async function POST(req) {
    const { inventoryNumber } = await req.json();
    try {
        await connectMongoDB();
        const id = await Appliance.find({ inventoryNumber: inventoryNumber  }).select("_id");
        return NextResponse.json({ id });
    } catch (error) {
        return NextResponse.json({ message: "Error occured while searching" }, { status: 500 });
    }
}