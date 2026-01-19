import MarketCard from "./MarketCard";

export default function MarketOverview() {
    const data = [
        { name: "Sample 1", price: 0, change: 0.0 },
        { name: "Sample 2", price: 0, change: 0.0 },
        { name: "Sample 3", price: 0, change: 0.0 },
    ];

    return (
        <div>
            {data.map((item) => (
                <MarketCard key={item.name} {...item} />
            ))}
        </div>
    );
}
