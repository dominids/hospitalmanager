import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import ApplianceNames from "../../../../../models/applianceNames";

export async function GET() {
    try {
        await connectMongoDB();
        const appliance = await ApplianceNames.find();
        console.log(appliance);
        return NextResponse.json({ appliance }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Error occured while fetching the data" }, { status: 500 });
    }
}

export async function PUT(req, res) {
    try {
        await connectMongoDB();
        const appliance = await ApplianceNames.find();
        console.log(appliance);
        return NextResponse.json({message: "Data updated successfully"});

    } catch (error) {
        return NextResponse.json({ message: "Error occured while fetching the data" }, { status: 500 });
    }
}