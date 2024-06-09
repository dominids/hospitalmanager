import { connectMongoDB } from "../../../../../../lib/mongodb";
import ApplianceNames from "../../../../../../models/applianceNames";
import EventNames from "../../../../../../models/eventNames";
import LocationNames from "../../../../../../models/locationNames";
import ManufacturerNames from "../../../../../../models/manufacturersNames";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }) {
    const { category, id } = params;
    console.log(`Request received: Method - DELETE, Category - ${category}, ID - ${id}`);
    await connectMongoDB();

    try {
        // Assuming the category corresponds to the model name
        console.log(category);
        let model;
        if (category === 'appliance') {
            model = ApplianceNames;
        } else if (category === 'event') {
            model = EventNames;
        } else if (category === 'location') {
            model = LocationNames;
        } else if (category === 'manufacturer') {
            model = ManufacturerNames;
        } else return NextResponse.json({ message: "Invalid category" }, { status: 500 });

        const deletedItem = await model.findByIdAndDelete(id);
        if (!deletedItem) {
            NextResponse.json({ message: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        NextResponse.json({ message: error.message }, { status: 404 });
    }
}

export async function PUT(req: NextRequest, { params }) {
    const { category, id } = params;
    const { name } = await req.json();

    console.log(`Request received: Method - PUT, Category - ${category}, ID - ${id}, Name - ${name}`);

    await connectMongoDB();

    try {
        let model;
        if (category === 'appliance') {
            model = ApplianceNames;
        } else if (category === 'event') {
            model = EventNames;
        } else if (category === 'location') {
            console.log("EEEj");
            model = LocationNames;
        } else if (category === 'manufacturer') {
            model = ManufacturerNames;
        } else return NextResponse.json({ message: "Invalid category" }, { status: 500 });

        const updatedItem = await model.findByIdAndUpdate(id, { name });
        if (!updatedItem) {
            return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedItem }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}