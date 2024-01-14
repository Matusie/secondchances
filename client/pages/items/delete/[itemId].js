import React from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../../hooks/use-request';
const DeleteItemPage = () => {
    const router = useRouter();
    const { itemId } = router.query;
    const { doRequest, errors } = useRequest({
        url: `/api/items/${itemId}`,
        method: 'delete',
        onSuccess: () => {
            router.push('/');
        },
        onError: (error) => {
            console.error('Error deleting item', error);
        },
    });

    const handleDelete = () => {
        doRequest();
    };

    return (
        <div>
            <h1>Delete Item</h1>
            <p>Are you sure you want to delete this product?</p>
            <button onClick={handleDelete}>Yes</button>
            {errors && <div>{errors}</div>}
        </div>
    );
};

export default DeleteItemPage;
