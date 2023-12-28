//responsible for rendering each of the pages created, so each of the components like landing page, showing item etc
import 'bootstrap/dist/css/bootstrap.css';
import createClient from '../api/create-client.js';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
      <Component currentUser={currentUser} {...pageProps} />
    </div>
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