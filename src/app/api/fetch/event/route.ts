import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import EventNames from "../../../../../models/eventNames";

export async function GET() {
    try {
        await connectMongoDB();
        const event = await EventNames.find();
        return NextResponse.json({ event });

    } catch (error) {
        return NextResponse.json({ message: "Error occured while fetching the data" }, { status: 500 });
    }
}