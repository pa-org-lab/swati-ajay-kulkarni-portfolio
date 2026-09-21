import { getPublicCategoriesWithFirstImage } from "@/backend/actions/category.action";

export default async function () {
    const data = await getPublicCategoriesWithFirstImage();
    console.log(data);
    return (
        <div className="grid grid-cols-4 gap-4">
            {data?.categories.map((category) => (
                <div key={category._id}>
                    <h1 className="text-xl font-bold">{category.name}</h1>
                    <img src={category.img} alt={category.alt} />
                    <h1 className="text-lg font-bold">{category.count}</h1>
                </div>
            ))}
        </div>
    );
}   