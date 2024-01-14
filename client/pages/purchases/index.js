import { Tab, Nav } from 'react-bootstrap';

const PurchaseIndex = ({ purchases }) => {
  return (

    <><Tab.Container id="myTab" defaultActiveKey="home">
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link eventKey="home">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="profile">Profile</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="messages">Messages</Nav.Link>
      </Nav.Item>
    </Nav>
    <Tab.Content>
      <Tab.Pane eventKey="home">
        <p>Home content goes here</p>
      </Tab.Pane>
      <Tab.Pane eventKey="profile">
        <p>Profile content goes here</p>
      </Tab.Pane>
      <Tab.Pane eventKey="messages">
        <p>Messages content goes here</p>
      </Tab.Pane>
    </Tab.Content>
  </Tab.Container></>
    
    // <Tab.Container id="left-tabs-example" defaultActiveKey="first">
    //   <Nav variant="pills" className="flex-column">
    //     <Nav.Item>
    //       <Nav.Link eventKey="first">Tab 1</Nav.Link>
    //     </Nav.Item>
    //     <Nav.Item>
    //       <Nav.Link eventKey="second">Tab 2</Nav.Link>
    //     </Nav.Item>
    //   </Nav>
    //   <Tab.Content>
    //     <Tab.Pane eventKey="first">
    //       <ul>
    //         {purchases.map(purchase => {
    //           return <li key={purchase.id}>
    //             {purchase.item.title} - {purchase.status}
    //           </li>
    //         })}
    //       </ul>
    //     </Tab.Pane>
    //     <Tab.Pane eventKey="second">
    //       <p>Content for Tab 2</p>
    //     </Tab.Pane>
    //   </Tab.Content>
    // </Tab.Container>
  )
}

PurchaseIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/purchases');

  return { purchases: data };
};

export default PurchaseIndex;