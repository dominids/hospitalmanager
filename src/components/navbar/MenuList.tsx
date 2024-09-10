import { NavListElement } from "./NavListElement";

export default function MenuList({ }) {
    return (<ul className="w-52">
        <li className="px-2 select-none">&nbsp;</li>
        <NavListElement displayedName="New whole appliance" url="/add/wholeAppliance" />
        <hr className="border border-black border-solid"></hr>
        <li className=" bg-teal-100 font-bold px-2">ADD NEW VALUES</li>
        <NavListElement displayedName="Appliance" url="/add/appliance" />
        <NavListElement displayedName="Event" url="/add/event" />
        <NavListElement displayedName="Location" url="/add/location" />
        <NavListElement displayedName="Manufacturer" url="/add/manufacturer" />
        <NavListElement displayedName="Provider" url="/add/provider" />
        <hr className="border border-black border-solid"></hr>
        <NavListElement displayedName="Manage Users" url="/manageUsers"/>
    </ul>);
}