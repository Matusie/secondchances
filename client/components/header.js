import Link from 'next/link';
import Image from 'next/image'
import Logo from './log.png'
import signup from './signup.png'

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: <Image src={signup} width={70} height={70}/>, href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Twoje itemy', href: '/purchases'},
    currentUser && {label: `Dodaj itema`, href:'/items/add'},
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link className="nav-link" href={href}>
            {label}
          </Link>
        </li>
      );
    });
//to create a link, we have to use the library AND nabar as anchor component
  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
      <Image
      src={Logo}
      width={70}
      height={70}
    />
</Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
  
};
