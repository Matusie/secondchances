//currently serves as landing page of the application
//although all of the itmes will be seen here
import createClient from '../api/create-client';
import Link from 'next/link';

const LandingPage = ({ currentUser, items }) => {
  //looping up arrays of items, to build up each row for each item
  
  const itemList = items.map((item) =>{
    return (
      <tr key={item.id}>
        <td>{item.title}</td>
        <td>{item.price}</td>
        <td>
        <a href={'/items/' + item.id}>Przejdz do przedmiotu</a>
        </td>
      </tr>
    )
  })
  // return currentUser ? (
  //   <h1>You are signed in</h1>
  // ) : (
  //   <h1>You are NOT signed in</h1>
  // );
  //ACTUALLY A TABLE OF ALL ITEMS
  return (
    <div>
      <h1>Dostepne przedmioty</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          {itemList}
        </tbody>
      </table>
    </div>
  )
};
//passing initial prop (current user and built client in this matter) to the child component
//fetching data from data property HERE IS SHOWING ALL OF THE ITEMS
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const {data} = await client.get('/api/items');
  return {items: data};

};


export default LandingPage;




  

