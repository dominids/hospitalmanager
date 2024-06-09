import ApplianceNames from "../../../../models/applianceNames";
import EventNames from "../../../../models/eventNames";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import LocationNames from "../../../../models/locationNames";
import ManufacturerNames from "../../../../models/manufacturersNames";

export async function POST(req) {
    try {
        const { src, name, } = await req.json();

        await connectMongoDB();
        switch (src) {
            case "appliance":
                await ApplianceNames.create({ name })
                break;
            case "event":
                await EventNames.create({ name })
                break;
            case "location":
                await LocationNames.create({ name })
                break;
            case "manufacturer":
                await ManufacturerNames.create({ name })
                break;
        }
        console.log(`Registered ${src}: ${name}`);

        return NextResponse.json({ message: `${name} registered in category ${src}` }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error occured while registering" }, { status: 500 });
    }
}