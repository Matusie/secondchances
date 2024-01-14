import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
const Unauthorized = () => {
    return (
        <div className="container">
            <div className="alert alert-danger mt-5">
                <h4>Brak dostępu</h4>
                <p>Nie masz uprawnień do tej części aplikacji.</p>
            </div>
            <div className='alert alert-primary fade show d-grid gap-2 d-sm-flex justify-content-between'>
                <h5 className='d-flex flex-column'>Nie masz konta? 
                    <Link className='btn btn-primary mt-2' href="/auth/signup">
                        Zarejestruj
                    </Link>
                </h5>
                <h5 className='d-flex flex-column'>Masz juz konto?
                    <Link className="btn btn-primary mt-2" href='/auth/signin'>
                        Zaloguj
                    </Link>
                </h5>
            </div>
        </div>
    );
};

export default Unauthorized;
