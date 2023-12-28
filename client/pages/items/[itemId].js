import Router from 'next/router';
import useRequest from '../../hooks/use-request';
//implementing getinital props about itemId
//context = id inside of the url, so query
const ItemShow = ({ item }) => {  
    //doRequest to run anytime 
    const {doRequest, errors }=useRequest({
        url: '/api/purchases',
        method: 'post',
        body: {
            itemId: item.id
        },
        //calling purchase when it is created
        onSuccess: (purchase) => Router.push('/purchases/[purchaseId]',`/purchases/${purchase.id}`)
    })
    return <div>
        <h1>{item.title}</h1>
        <h4>Price:{item.price}</h4>
        {errors}
        <button onClick={()=> doRequest()} className="btn btn-primary">Purchase</button>
        </div>;
};
ItemShow.getInitialProps = async (context, client) =>{
    const{itemId} = context.query;
    const {data} = await client.get(`/api/items/${itemId}`);
    return{item: data};
}
export default ItemShow;

// const PurchaseShow = ({purchase}) => {
//     //calcualting time left to expire
//     const msLeft = new Date(purchase.expiresAt) - new Date();
//         return <div>{msLeft /1000} seconds until order exipres</div>;
//     };
//     //getting acces to the purchase, which means fetching data using initialprops
//     PurchaseShow.getInitialProps = async (context,client) => {
//         const {purchaseId} = context.query;
//         const {data} = await client.get(`/api/purchases/${purchaseId}`)
//     return{purchase:data}
//     }
//     export default PurchaseShow;