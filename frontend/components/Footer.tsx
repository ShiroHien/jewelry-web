import React from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from './icons/FacebookIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import Logo from './icons/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-16">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-12">
          <h3 className="text-2xl font-serif-display text-black mb-6">Contact Us</h3>
          <div className="flex justify-center items-center space-x-8">
            <a href="mailto:kimloan2104@gmail.com" className="flex items-center space-x-2 hover:text-black transition-colors">
              <EmailIcon />
              <span>kimloan2104@gmail.com</span>
            </a>
            <a href="tel:+843726992272" className="flex items-center space-x-2 hover:text-black transition-colors">
              <PhoneIcon />
              <span>+84 3726992272</span>
            </a>
            <a href="https://www.facebook.com/kimloan2104" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-black transition-colors">
              <FacebookIcon />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-12">
          <a href="#" className="inline-block text-black mb-6">
            <Logo className="h-14 mx-auto" />
          </a>
          <p className="text-sm mt-4">&copy; {new Date().getFullYear()} KLORA Jewelry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;