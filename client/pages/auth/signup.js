import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [terms, setTerms] = useState(false);
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
      avatar,
      firstName,
      lastName,
      terms
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  const getPicture = (e) => {
    const file = e.target.files[0]
    var reader = new FileReader();
    reader.addEventListener("load", () => setAvatar(reader.result), false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (

        <form onSubmit = {onSubmit}>
        <h1>Rejestracja</h1>
        <div className="form-group">
          <label htmlFor="firstName">
            Imie
          </label>
          <input value={firstName} onChange={event => setFirstName(event.target.value)} 
            className="form-control" 
            type="text" 
            name="firstName" 
            placeholder="John" 
            id="firstName" 
          />
          <label htmlFor="lastName">
            Nazwisko
          </label>
          <input value={lastName} onChange={event => setLastName(event.target.value)} 
            className="form-control" 
            type="text" 
            name="lastName" 
            placeholder="Doe" 
            id="lastName" 
          />
          <label htmlFor="EmailInput">
            Email Address
          </label>
          <input value={email} onChange={event => setEmail(event.target.value)} 
            className="form-control" 
            type="text" 
            name="Email address" 
            placeholder="np. pbs@pbs.pl" 
            id="EmailInput" 
          />
          <label htmlFor="hasloInput">
            Hasło
          </label>
          <input 
            value={password} onChange={event => setPassword(event.target.value)} 
            className="form-control" 
            type="password" 
            name="unit" 
            placeholder="od 4 do 20 znaków" 
            id="hasloInput"
          />
          <label htmlFor='formFileSm'>Avatar</label>
          <input
            style={{ width: "418px" }}
            className="form-control"
            id="formFileSm"
            type="file"
            accept="image/png, image/jpeg"
            onChange={getPicture}
          />
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" onChange={event => setTerms(event.target.checked)} id="terms" />
          <label className="form-check-label" htmlFor="terms"> Zgadzam sie na regulamin </label>
        </div>
        <button className="btn btn-success mt-1 ">Zarejestruj się</button>
        {errors}
        </form>
        );
};
