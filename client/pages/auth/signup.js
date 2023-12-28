import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  return (

        <form onSubmit = {onSubmit}>
        <h1>Rejestracja</h1>
        <div className="form-group"></div>
        <label for="EmailInput">Email Address</label>
        <input value={email} onChange={event => setEmail(event.target.value)} 
        className="form-control" 
        type="text" 
        name="Email address" 
        placeholder="np. pbs@pbs.pl" 
        id="EmailInput" ></input>
        
        <div className="form-group"></div>
        <label for="hasloInput">Hasło</label>
        <input value={password} onChange={event => setPassword(event.target.value)} 
        className="form-control" 
        type="password" name="unit" 
        placeholder="od 4 do 20 znaków" 
        id="hasloInput"/>
        <button className="btn btn-success">Zarejestruj się</button>
        {errors}
        </form>
        );
};
