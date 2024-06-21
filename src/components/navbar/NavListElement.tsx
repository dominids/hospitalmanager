import Link from "next/link";

export function NavListElement({ displayedName, url }) {
    return (<li className="hover:bg-teal-200 px-2 bg-teal-100 font-bold">
        <Link href={url}>
            {displayedName}
        </Link>
    </li>);
};
  