import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCategory } from '../types';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import Logo from './icons/Logo';

const navLinks: { name: ProductCategory, path: string }[] = [
  { name: ProductCategory.Bracelets, path: '/bracelets' },
  { name: ProductCategory.Necklaces, path: '/necklaces' },
  { name: ProductCategory.Pendants, path: '/pendants' },
  { name: ProductCategory.Earrings, path: '/earrings' },
  { name: ProductCategory.Rings, path: '/rings' },
  { name: ProductCategory.Sets, path: '/sets' },
  { name: ProductCategory.Others, path: '/others' },
  { name: ProductCategory.Blog, path: '/blog' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <Logo className="h-9" />
          </Link>
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="relative group text-base uppercase tracking-widest text-black py-1">
                {link.name}
                <span className="absolute inset-x-0 bottom-0 h-[1px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-center"></span>
              </Link>
            ))}
          </nav>
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Open menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <Link to="/">
            <Logo className="h-9" />
          </Link>
          <button onClick={() => setIsOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full space-y-8 -mt-20">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className="relative group text-2xl uppercase tracking-widest text-black py-2"
            >
              {link.name}
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-center"></span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;