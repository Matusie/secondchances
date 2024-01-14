import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import CommentForm from '../../components/comentForm';
import Link from 'next/link';
//implementing getinital props about itemId
//context = id inside of the url, so query
const ItemShow = ({ item, user }) => {  
    //doRequest to run anytime 
    const purchase=useRequest({
        url: '/api/purchases',
        method: 'post',
        body: {
            itemId: item.id
        },
        //calling purchase when it is created
        onSuccess: (purchase) => Router.push('/purchases/[purchaseId]',`/purchases/${purchase.id}`)
    })
    if(item.avatar===null){
        item.avatar='https://source.unsplash.com/random/250x300/?tshirt';
    }
    return (
        <div className='mt-4 row gap-2'>
            <div className="col-md-4 card-body">
                <rect width="100%" height="100%" fill="#868e96"><img src={item?.avatar} className="rounded mx-auto d-block img-fluid" alt="Placeholder: Image"/></rect>
            </div>
            <div className='col-md-4 card-body'>
                <h1>{item.title}</h1>
                <h4>Price:{item.price}</h4>
                <h5>{item?.description}</h5>
                <h6>Selling: <a className='btn btn-outline-info' onClick={()=>Router.push(`/users/[userId]`,`/users/${user?.id}`)}>{user?.email}</a></h6>
                {purchase.errors}
                <button onClick={()=> purchase.doRequest()} className="btn btn-primary">Purchase</button>
            </div>
            <div>
                kupujesz juz ktorys raz od tego sprzedawcy? 
                zostaw mu komentarz!
                <CommentForm userId={item.userId} title={item.title}/>
            </div>
        </div>
    )
};
ItemShow.getInitialProps = async (context, client) =>{
    const{itemId} = context.query;
    const {data} = await client.get(`/api/items/${itemId}`);
    const user= await client.get(`/api/users/${data.userId}`);
    return{item: data, user: user.data};
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