import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { totalItems } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-cafe-brown text-cafe-cream sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-cafe-gold" />
            <span className="text-2xl font-serif font-bold tracking-tight">Bean & Brew</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-cafe-gold",
                  location.pathname === link.path ? "text-cafe-gold" : "text-cafe-cream/80"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative p-2 hover:text-cafe-gold transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-cafe-gold text-cafe-dark text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAdmin ? (
              <Link to="/admin" className="flex items-center space-x-1 bg-cafe-gold text-cafe-dark px-4 py-2 rounded-full text-sm font-bold hover:bg-cafe-beige transition-colors">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link to="/admin/login" className="p-2 hover:text-cafe-gold transition-colors">
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-cafe-gold text-cafe-dark text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-cafe-dark border-t border-cafe-brown">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium hover:bg-cafe-brown transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-medium text-cafe-gold"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
