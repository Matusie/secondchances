import { useEffect } from 'react';
//currently serves as landing page of the application
//although all of the items will be seen here
import Link from 'next/link';
import Unauthorized from '../../components/unauthorized';
import ListItem from '../../components/listItem';

const LandingPage = ({ currentUser, items, purchases }) => {
  let columnCount;
  useEffect(() => {
    const screenWidth = window.innerWidth;
    console.log(screenWidth)
    if (screenWidth < 768) {
      columnCount = 1; // Telefon
      console.log(columnCount)

    } else if (screenWidth < 992) {
      columnCount = 2; // Tablet
      console.log(columnCount)

    } else {
      columnCount = 3; // Laptop i większe ekrany
      console.log(columnCount)
    }
  }, []);
  if(purchases==="not logged in"){
    return (
      <Unauthorized />
    );
  }
  const itemList = items.map((item) => {
    if(purchases){
      purchases.map((purchase) => {
        if (purchase.item.id === item.id) {
          if(purchase.userId===currentUser?.id){
            item.purchase = purchase;
          }
          else if(purchase.id){
            item.expiresAt = purchase?.expiresAt;
          }
          else{
            item.purchase.expiresAt = undefined;
          }
          item.status = purchase.status;
        }
      });

    }

      return (
        
          
            <ListItem 
              key={item.id}
              item={item}
              currentUser={currentUser}
            />
      
      );
  });
  return (
    <div>
      <h1>Dostepne przedmioty</h1>
      <div className="card-columns" style={{ 'columnGap':'0.25rem'}}>
        {itemList}
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const purchase = await client.get('/api/purchases');
  const { data } = await client.get('/api/items');
  return { items: data, purchases: purchase.data };
};

export default LandingPage;






  

