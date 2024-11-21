import React from 'react';
import { Link } from 'react-router-dom';
import LinkButton from './components/LinkButton';
import keylabIcon from './assets/keylab-icon.svg';
import { ShoppingCart, UserRound, Heart } from 'lucide-react';
import { useAuth } from './AuthContext';

const NavBar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth(); // gets auth state from AuthContext

    return (
        // TODO: add a mobile menu
        <nav className='bg-white/75 border-b backdrop-blur-sm fixed top-0 left-0 right-0'>
            <div className='p-5 max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto'>
                <div className="w-1/3 h-5 items-center flex">
                    <div className="pe-8 text-center text-black font-body"><Link to="/keyboard-designer">KEYBOARD DESIGNER</Link></div>
                    <div className="pe-8 text-center text-black font-body"><Link to="/shop">SHOP</Link></div>
                    <div className="text-center text-black font-body"><Link to="/about">ABOUT</Link></div>
                </div>
                <div className='w-1/3'>
                    <a href="#" className='items-center justify-center flex'>
                        <img src={keylabIcon} alt="keylab icon" className="h-14 w-14 me-2" />
                        <div className="text-center text-4xl text-black font-display">keylab</div>
                    </a>
                </div>
                <div className='w-1/3 flex justify-end items-center'>
                    {isAuthenticated ? (<>
                        {/* TODO: remove temporary logout button */}
                        <button onClick={() => logout()} className='bg-secondary-dark text-white px-6 py-2 text-sm rounded-full'>temp logout btn</button>
                        <LinkButton to="/profile" buttonClassNames='ms-2 h-10 w-10 bg-white' Icon={UserRound} />
                        <LinkButton to="/favorites" buttonClassNames='ms-2 h-10 w-10 bg-white' Icon={Heart} />
                    </>
                    ) : (<>
                        <LinkButton to="/sign-in" text="Sign in" textClassNames="px-6" buttonClassNames='bg-white' />
                        <LinkButton to="/register" text="Register" textClassNames="px-6" buttonClassNames='bg-secondary-dark ms-2' />
                    </>
                    )}
                        <LinkButton to="/cart" buttonClassNames='ms-2 h-10 w-10 bg-white' Icon={ShoppingCart} />
                </div>
            </div>
        </nav>
    );
}

export default NavBar;