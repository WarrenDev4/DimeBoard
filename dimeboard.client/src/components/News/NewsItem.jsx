export default function NewsItem({ title, source }) {
    return (
        <div>
            <h4>{title}</h4>
            <small>{source}</small>
        </div>
    );
}
