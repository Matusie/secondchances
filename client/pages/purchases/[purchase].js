import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const purchaseShow = ({ purchase, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      purchaseId: purchase.id,
    },//jezeli zakupione, popchniete do purchases
    onSuccess: () => Router.push('/items')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(purchase.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [purchase]);

  if (timeLeft < 0) {
    return <div>purchase Expired</div>;
  }

  return (
    <div>
      <span>
      Time left to pay: {timeLeft} seconds
      </span>
      itemId:{purchase.id}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51ORiyUIbpHnpIJg28ue0ITskOxQrAvxHfKFL6OlbCeZ9Ec26Zv0TPo37ohmV1wCmpRC7hLFhYvnYpg92nvUT7x1s00fMMXWMDO"
        amount={purchase.item?.price * 100}
        email={currentUser.email}
        currency = 'PLN'
      />
      {errors}
    </div>
  );
};

purchaseShow.getInitialProps = async (context, client) => {
  const  purchaseId  = context.query.purchase;
  const { data } = await client.get(`/api/purchases/${purchaseId}`);

  return { purchase: data, purchaseId:data.item.id};
};

export default purchaseShow;
