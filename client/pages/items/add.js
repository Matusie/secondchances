import { useState } from "react";
import useRequest from '../../hooks/use-request'
import Router from 'next/router';
const AddItem = () => {
    //hooks to change the title, price, and avatar and make connection with the backend
    const [title, setTitle] = useState('');
    const [price, setprice] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [description, setDescription] = useState('');
    const getPicture = (e) => {
        const file = e.target.files[0]
        var reader = new FileReader();
        reader.addEventListener("load", () => setAvatar(reader.result), false);
    
        if (file) {
          reader.readAsDataURL(file);
        }
      }
    const { doRequest, errors} = useRequest({
        url: '/api/items',
        method: 'post', //post is small because of the axios
        body: {
            title, price, avatar, description,
        }, //after making an item, redirect to /
        onSuccess: (item) => Router.push('/items'),
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
export default AddItem;