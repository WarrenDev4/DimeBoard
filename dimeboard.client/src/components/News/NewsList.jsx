import NewsItem from "./NewsItem";

export default function NewsList() {
    const news = [
        { id: 1, title: "Bitcoin hits new high", source: "CoinDesk" },
        { id: 2, title: "Stocks rally today", source: "Bloomberg" },
    ];

    return (
        <div>
            {news.map((item) => (
                <NewsItem key={item.id} {...item} />
            ))}
        </div>
    );
}
;