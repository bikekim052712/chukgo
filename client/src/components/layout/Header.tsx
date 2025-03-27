import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "서비스", href: "#services" },
    { name: "코치", href: "/coaches" },
    { name: "레슨", href: "/lessons" },
    { name: "FAQ", href: "#faq" },
    { name: "문의하기", href: "#contact" },
  ];

  return (
    <header className="bg-white shadow-sm fixed w-full z-10 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <span className="text-primary font-bold text-2xl">축구레슨</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-6">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={`font-medium hover:text-primary transition-colors ${
                        (item.href === location || 
                         (item.href.startsWith('#') && location === '/' + item.href) || 
                         (item.href !== '/' && location.startsWith(item.href)))
                          ? 'text-primary'
                          : 'text-neutral-800'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="#" className="font-medium">로그인</Link>
              </Button>
              
              <Button asChild>
                <Link href="#">회원가입</Link>
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-neutral-200">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className={`block font-medium py-2 transition-colors ${
                      (item.href === location || 
                       (item.href.startsWith('#') && location === '/' + item.href) || 
                       (item.href !== '/' && location.startsWith(item.href)))
                        ? 'text-primary'
                        : 'text-neutral-800'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-3 pt-4 border-t border-neutral-200 mt-4">
              <Button variant="ghost" asChild>
                <Link href="#" className="justify-center" onClick={closeMobileMenu}>로그인</Link>
              </Button>
              
              <Button asChild>
                <Link href="#" onClick={closeMobileMenu}>회원가입</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
