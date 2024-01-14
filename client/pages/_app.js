//responsible for rendering each of the pages created, so each of the components like landing page, showing item etc
import 'bootstrap/dist/css/bootstrap.css';
import createClient from '../api/create-client.js';
import Header from '../components/header';
import '../components/listItem.scss'
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  
  
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
      const headerElement = document.querySelector('.navbar');
      const height = headerElement.getBoundingClientRect().height;
      setHeaderHeight(height);
    }, []);

    
    return (
      <div className='bg-body-secondary h-100 '>
        <Header currentUser={currentUser} />
        <div className='container h-100 ' style={{ "marginTop": `${headerHeight}px`}}>
          <Component currentUser={currentUser} {...pageProps} />
        </div>
        <footer className='bg-dark text-light text-center py-3'>
          <Container>
            This is the footer.
          </Container>
        </footer>
      </div>
  );
};

//getInitialProps function's goal is to fetch some data that is 
// required to show the app component to the user.
//fetching data about the current user
//by deafult we call getInitialProps of APPCOMPONENT, and landingpagecomponent not  
AppComponent.getInitialProps = async (appContext) => {
  const client = createClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
//making sure that "child" component that we are trying to display has initialprops
// and if it does, we call it
  let pageProps = {};
  if (appContext.Component.getInitialProps) { //to not build each time, we add client to the second argument.
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser); //same with the current user, we have to know it just once
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;