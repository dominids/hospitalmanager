import { useState, createContext, useEffect } from "react";
import { Item } from "../../global";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
const MyContext = createContext("123456789");
export default function Select({ category, value }) {
    const { data: session } = useSession();
    const [data, setData] = useState<{ [key: string]: Item[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchData(category);
    }, [])

    const fetchData = async (category: string) => {
        if (!session?.user?.role) redirect("/dashboard")
        try {
            value("select#123456789");
            const resNameExists = await fetch(`/api/fetch/${category}`, {
                method: "GET", //method in api
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const resNameExistsJSON = await resNameExists.json();
            if (resNameExistsJSON && typeof resNameExistsJSON === 'object') {
                setIsLoading(false);
                setData(resNameExistsJSON);
            } else {
                console.error('Fetched data is not in the expected format');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <select className="w-full p-3 text-ellipsis" onChange={(e) => value(e.target.value)}>
            {
                isLoading ? (
                    <option>Loading</option>
                ) : (<>
                    <option defaultChecked value={"select#123456789"}>select</option>
                    {Object.keys(data).map((category) => (
                        data[category].map((item) => (
                            <option key={item._id} value={item.name}>
                                {item.name}
                            </option>
                        ))
                    ))}
                </>)
            }
        </select>
    );
}