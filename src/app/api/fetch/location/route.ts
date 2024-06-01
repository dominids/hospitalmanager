import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import LocationNames from "../../../../../models/locationNames";

export async function GET() {
    try {
        await connectMongoDB();
        const locationNames = await LocationNames.find();
        return NextResponse.json({ locationNames });

    } catch (error) {
        return NextResponse.json({ message: "Error occured while fetching the data" }, { status: 500 });
    }
}