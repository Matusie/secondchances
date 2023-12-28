//FAJNE pokazanie STATUSU, mozesz wykorzystac zdecydowanie
const PurchaseIndex = ({purchases}) => {
    return <ul>
        {purchases.map(purchase=>{
            return <li key={purchase.id}>
                {purchase.item.title} - {purchase.status}
            </li>
        })}
    </ul>
}

PurchaseIndex.getInitialProps = async (context, client) => {
    const {data} = await client.get('/api/purchases');

    return { purchases: data};
};

export default PurchaseIndex;