import ApplianceNames from "../../../../models/applianceNames";
import EventNames from "../../../../models/eventNames";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import LocationNames from "../../../../models/locationNames";
import ManufacturerNames from "../../../../models/manufacturersNames";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { src, name, } = await req.json();
        console.log(src, name);

        switch (src) {
            case "appliance":
                const appliance = await ApplianceNames.findOne({ name }).select("_id");
                return NextResponse.json({ appliance });
                break;
            case "event":
                const event = await ApplianceNames.findOne({ name }).select("_id");
                return NextResponse.json({ event });
                break;
            case "location":
                const location = await ApplianceNames.findOne({ name }).select("_id");
                return NextResponse.json({ location });
                break;
            case "manufacturer":
                const manufacturer = await ApplianceNames.findOne({ name }).select("_id");
                return NextResponse.json({ manufacturer });
                break;
        }


        console.log(`Registered ${src}: ${name}`);

        return NextResponse.json({ message: `${name} registered in category ${src}` }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error occured while registering" }, { status: 500 });
    }
}