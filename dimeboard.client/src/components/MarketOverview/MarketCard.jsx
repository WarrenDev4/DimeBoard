export default function MarketCard({ name, price, change }) {
    return (
        <div>
            <h4>{name}</h4>
            <p>${price}</p>
            <span>{change}%</span>
        </div>
    );
}