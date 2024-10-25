import React from 'react';
import { Link } from 'react-router-dom';
import LinkButton from './components/LinkButton';
// TODO: import auth state

const NavBar: React.FC = () => {
    const isAuthenticated = false; // TODO: replace with auth state

    return (
        // TODO: add a mobile menu
        <nav className='bg-white/50 border-b backdrop-blur-sm fixed top-0 left-0 right-0'>
            <div className='p-8 max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto'>
                <div className="w-1/3 h-5 items-center flex">
                    <div className="pe-8 text-center text-black font-body"><Link to="/keyboard-designer">KEYBOARD DESIGNER</Link></div>
                    <div className="pe-8 text-center text-black font-body"><Link to="/shop">SHOP</Link></div>
                    <div className="text-center text-black font-body"><Link to="/about">ABOUT</Link></div>
                </div>
                <div className='w-1/3'>
                    <a href="#">
                        <div className="text-center text-4xl text-black font-display">keylab</div>
                    </a>
                </div>
                {isAuthenticated ? (
                    <div className='w-1/3'>
                        {/* TODO: add button for: profile, favorites, cart */}
                    </div>
                ) : (
                    <div className='w-1/3 flex justify-end'>
                        <LinkButton to="/sign-in" text="Sign in" textClassNames="px-6" />
                        <LinkButton to="/register" text="Register" textClassNames="px-6" buttonClassNames='bg-secondary-darker ms-2' />
                        {/* TODO: add button for: cart */}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;