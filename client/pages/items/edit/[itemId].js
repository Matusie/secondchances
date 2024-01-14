import { useState } from "react";
import useRequest from '../../../hooks/use-request'
import Router from 'next/router';
const EditItem = ({ item }) => {
    //hooks to change the title, price, and avatar and make connection with the backend
    const [title, setTitle] = useState(item.title);
    const [price, setprice] = useState(item.price);
    const [avatar, setAvatar] = useState(item.avatar);
    const [description, setDescription] = useState(item.description);
    
    const getPicture = (e) => {
        const file = e.target.files[0]
        var reader = new FileReader();
        reader.addEventListener("load", () => setAvatar(reader.result), false);
    
        if (file) {
          reader.readAsDataURL(file);
        }
    }
    const { doRequest, errors} = useRequest({
        url: `/api/items/${item.id}`,
        method: 'put', //post is small because of the axios
        body: {
            title, price, avatar, description,
        }, //after making an item, redirect to /
        onSuccess: () => Router.push('/items'), // Removed unused 'item' parameter
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
        <h1> Edytuj przedmiot</h1>
        <form onSubmit={onSubmit}>
            <div className='form-group'>
                <label>Tytul</label>
                <input value={title} onChange={(e)=> setTitle(e.target.value)} className="form-control"/>
            </div>
            <div className='form-group'>
            <label>Cena</label>
            <input value={price} onBlur={onBlur} onChange={(e)=> setprice(e.target.value)} className='form-control'/>
            </div>
            <div className='form-group'>
            <label>Avatar</label>
            <input
                style={{ width: "418px" }}
                className="form-control"
                id="formFileSm"
                type="file"
                accept="image/png, image/jpeg"
                onChange={getPicture}
            />
            </div>
            <div className='form-group'>
            <label>Opis</label>
            <input value={description} onChange={(e)=> setDescription(e.target.value)} className='form-control'/>
            </div>
            {errors}
            <button className='btn btn-success'>Zatwiedz</button>
        </form>
    </div>);
};

EditItem.getInitialProps = async (context, client) =>{
    const{itemId} = context.query;
    const {data} = await client.get(`/api/items/${itemId}`);
    const user= await client.get(`/api/users/${data.userId}`);
    return{item: data, user: user.data};
}
export default EditItem;
