import React from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from './icons/FacebookIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import Logo from './icons/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-14 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="mb-10 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-serif-display text-black mb-5 sm:mb-6">Contact Us</h3>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-x-8 sm:gap-y-4">
            <a href="mailto:kimloan2104@gmail.com" className="flex items-center justify-center space-x-2 hover:text-black transition-colors">
              <EmailIcon />
              <span>kimloan2104@gmail.com</span>
            </a>
            <a href="tel:+84913036796" className="flex items-center justify-center space-x-2 hover:text-black transition-colors">
              <PhoneIcon />
              <span>+84 913036796</span>
            </a>
            <a href="https://www.facebook.com/kimloan2104" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 hover:text-black transition-colors">
              <FacebookIcon />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-10 sm:pt-12">
          <a href="#" className="inline-block text-black mb-6">
            <Logo className="h-14 mx-auto" />
          </a>
          <p className="text-sm mt-4 px-2">&copy; {new Date().getFullYear()} KLORA Jewelry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;