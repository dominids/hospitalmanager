    import { connectMongoDB } from "../../../../../lib/mongodb";
    import EventNames from "../../../../../models/eventNames";
    import LocationNames from "../../../../../models/locationNames";
    import ManufacturerNames from "../../../../../models/manufacturersNames";
    import ApplianceNames from "../../../../../models/applianceNames";
    import { NextRequest, NextResponse } from "next/server";
    import ProviderNamesSchema from "../../../../../models/providerNames";

    export async function GET(req: NextRequest, { params }) {
        const { category} = params;

        console.log(`Request received: Method - GET, Category - ${category}`);

        await connectMongoDB();

        try {
            let model;
            if (category === 'appliance') {
                model = ApplianceNames;
            } else if (category === 'event') {
                model = EventNames;
            } else if (category === 'location') {
                model = LocationNames;
            } else if (category === 'manufacturer') {
                model = ManufacturerNames;
            }else if (category === 'provider') {
                model = ProviderNamesSchema;
            } else return NextResponse.json({ message: "Invalid category" }, { status: 500 });

            const fetchedItem = await model.find().sort({"name": "asc"});
            if (!fetchedItem) {
                return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
            }

            return NextResponse.json({ fetchedItem }, { status: 201 });
        } catch (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
    }