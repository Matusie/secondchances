import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import useRequest from '../hooks/use-request';
const ListItem = ({ item ,currentUser}) => {
    if(item?.avatar===null||item?.avatar===undefined){
        item.avatar='https://source.unsplash.com/random/250x300/?tshirt';
    }
    const expiresAt = new Date(item?.purchase?.expiresAt||item?.expiresAt);
    const expiresAtDate = new Date(expiresAt);
const utcExpiresAt = new Date(expiresAtDate.getTime() + expiresAtDate.getTimezoneOffset() * 60000);
const formattedExpiresAt = utcExpiresAt.toLocaleString();
    const purchase=useRequest({
        url: '/api/purchases',
        method: 'post',
        body: {
            itemId: item.id
        },
        //calling purchase when it is created
        onSuccess: (purchase) => Router.push('/purchases/[purchaseId]',`/purchases/${purchase.id}`)
    })

    return item.status!=='completed'?(
            
            // <div className='col'>
            //     <div className="card h-100 ">
            //         <div className="row g-0 h-100">
            //             <div className="col-md-4">
            //             <rect width="100%" height="100%" fill="#868e96"><img src={item?.avatar} className=" h-100 rounded-start-md-2 rounded-top-2  w-100  d-block img-fluid" alt="Placeholder: Image"/></rect>
            //             </div>
            //             <div className="col-md-8 h-100">
            //                 <div className="card-text card-body d-flex h-100 flex-column justify-content-between">
            //                     <div className="card-text d-flex justify-content-between">{item.status === 'created' ? (
            //                     <div><p className='badge text-bg-warning rounded-pill'>
            //                         <small className="text-body-secondary">Zarezerwowane</small></p><p> Rezerwacja do {formattedExpiresAt}</p></div>
            //                     ) : item.status === 'cancelled' ? (<p className='badge text-bg-info rounded-pill'>
            //                         <small className="text-body-secondary">Znow w sprzedazy</small></p>
            //                     ) : item.status === undefined ? (<p className='badge text-bg-success rounded-pill'>
            //                         <small className="text-body-secondary">Nowe na rynku</small></p>
            //                     ) : null}
            //                     { currentUser?.id===item.userId? (
            //                         <button onClick={()=>Router.push(`/items/edit/[itemId]`,`/items/edit/${item?.id}`)} className="btn btn-outline-secondary d-flex">
            //                         <span className="material-icons">
            //                         tune
            //                         </span>
            //                             </button>
            //                         ):null
            //                     }
            //                     </div>
            //                     <h5 className="card-title">{item.title}</h5>
            //                     {item?.description?(<p className="card-text">{item?.description}</p>):(<p className="card-text">Autor nie dodal opisu dla przedmiotu "{item.title}"</p>)}
            //                     <div className='d-flex justify-content-around  '>
                                    
            //                         <div className='btn btn-sm btn-outline-success d-flex justify-content-center flex-wrap  ' onClick={()=> purchase.doRequest()}>
            //                             <span className="material-icons">
            //                                 shopping_cart
            //                             </span>
                                        
            //                         </div>
            //                         <Link href={'/items/' + item.id} style={{ textDecoration: "none" }}>
            //                             <div className='btn btn-outline-info d-flex justify-content-center flex-wrap  '>
            //                             <span className="material-icons">
            //                                 visibility
            //                             </span>
            //                             </div>
            //                         </Link>
            //                         {item?.purchase?.id && item.status=="created" && currentUser?.id===item.purchase.userId? (
            //                             <Link href={'/purchases/' + item?.purchase?.id} className='text-decoration-none'>
            //                                 <div className="btn btn-outline-success d-flex justify-content-center flex-wrap">
            //                                     <span className="material-icons">
            //                                         credit_card
            //                                     </span>
            //                                 </div>
            //                             </Link>
            //                         ) : null}
            //                     </div>
                                
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        <div className="card d-inline-block mb-2  shadow-sm">
            <rect width="100%" height="100%" fill="#868e96">
                <img src={item?.avatar} className="card-img-top" alt="Placeholder: Image"/>
            </rect>
            <div className="card-body">
                <div className='d-flex justify-content-between '>
                    <div className={` d-flex justify-content-between w-100`}>
                        
                        <h5 className='card-title text-wrap w-50'>{item.title}</h5> 
                        <div className="card-text d-flex justify-content-between" style={{height:'fit-content'}}>
                            {item.status === 'created' ? (
                                
                                <p className='badge text-bg-warning rounded-pill'>
                                    <small className="text-body-secondary">
                                        Zarezerwowane
                                    </small>
                                </p>
                                
                            ) : 
                            item.status === 'cancelled' ? (
                                <p className='badge text-bg-info rounded-pill'>
                                    <small className="text-body-secondary">
                                        Znow w sprzedazy
                                    </small>
                                </p>) : 
                            item.status === undefined ? (
                                <p className='badge text-bg-success rounded-pill'>
                                    <small className="text-body-secondary">
                                        Nowe na rynku
                                    </small>
                                </p>) : 
                            null}
                                    
                        </div>
                    </div>
                    { currentUser?.id===item.userId? (
                        <>
                            <div className="dropdown">
                                <button id={`btnGroupDrop${item.id}`} type="button" className="btn btn-sm btn-outline-secondary d-flex settings ms-1 dropdown-toggle align-items-center " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="material-icons">
                                        tune
                                    </span>
                                </button>
                                <div className="dropdown-menu" aria-labelledby={`btnGroupDrop${item.id}`} style={{minWidth:'fit-content',padding:'0.5rem'}}>
                                    <button onClick={() => Router.push(`/items/edit/[itemId]`, `/items/edit/${item?.id}`)} className="btn btn-sm btn-outline-secondary d-flex w-100 mb-1 ">
                                    <span className="material-icons">
                                        settings
                                    </span>edit
                                    </button>
                                    <button style={{width:'fit-content'}} onClick={() => Router.push(`/items/delete/[itemId]`, `/items/delete/${item?.id}`)} className="btn btn-sm btn-outline-danger d-flex">
                                    <span className="material-icons">
                                        delete
                                    </span> delete
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                    : null}
                            </div>
                            {item.status === 'created' ? (
                    <span className="card-text alert-danger ">
                    <i className="">
                        Rezerwacja do {formattedExpiresAt}
                    </i></span>
                ) : null}
                
                {item?.description?(
                    <p className="card-text">
                        {item?.description}
                    </p>):(
                    <p className="card-text">
                        Autor nie dodal opisu dla przedmiotu "{item.title}"
                    </p>)
                }
                <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">                    
                        {item.status=="created" && currentUser?.id===item.purchase.userId? (
                            <button onClick={()=>Router.push(`/purchases/[purchase]`,`/purchases/${item?.purchase?.id}`)} className="btn btn-sm btn-outline-success d-flex justify-content-center flex-wrap">
                                <span className="material-icons">
                                    credit_card
                                </span>
                            </button>
                        ) : null}
                        <div className='btn btn-sm btn-outline-success d-flex justify-content-center flex-wrap  ' onClick={()=> purchase.doRequest()}>
                            <span className="material-icons">
                                shopping_cart
                            </span>                            
                        </div>
                        
                        <button onClick={()=>Router.push(`/items/[itemId]`,`/items/${item?.id}`)} className="btn btn-sm btn-outline-secondary d-flex">
                            <span className="material-icons">
                                visibility
                            </span>
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
            
    ):null;
};

ListItem.getInitialProps = async ( currentUser) => {
    
    return { currentUser: currentUser };
};
export default ListItem;

