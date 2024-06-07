import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Appliance from "../../../../models/appliance";

export async function POST(req, res) {
    try {
        await connectMongoDB();
        const { inventoryNumber, currentId } = await req.json();
        const id2 = await Appliance.findOne({ inventoryNumber: inventoryNumber, _id: { $ne: currentId } }).select("_id");
        console.log("SCREAM FOR ME", id2);
        return NextResponse.json({ id2 });
    } catch (error) {
        return NextResponse.json({ message: "Error occurred while searching" }, { status: 500 });
    }
}
