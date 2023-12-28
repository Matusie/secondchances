import { useState } from "react";
import useRequest from '../../hooks/use-request'
import Router from 'next/router';
const AddItem = () => {
    //hooks to change the title and price and make connection with the backend
    const [title, setTitle] = useState('');
    const [price, setprice] = useState('');
    const { doRequest, errors} = useRequest({
        url: '/api/items',
        method: 'post', //post is small because of the axios
        body: {
            title, price,
        }, //after making an item, redirect to /
        onSuccess: (item) => Router.push('/'),
    });
//connection with the backend
    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    };
//onBlur, so when you click away, parsing price to have only two decimals or return NaN if wrong
    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)){
            return;
        }
        setprice(value.toFixed(2));
    }
    return (<div>
        <h1> No wez cos stworz</h1>
        <form onSubmit={onSubmit}>
            <div className='form-group'>
                <label>Tytul</label>
                <input value={title} onChange={(e)=> setTitle(e.target.value)} className="form-control"/>
            </div>
            <div className='form-group'>
            <label>Cena</label>
            <input value={price} onBlur={onBlur} onChange={(e)=> setprice(e.target.value)} className='form-control'/>
            </div>
            {errors}
            <button className='btn btn-success'>Zatwiedz</button>
        </form>
    </div>);
};
export default AddItem;