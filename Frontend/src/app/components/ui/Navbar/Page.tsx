"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/app/components/ui/resizable-navbar";
import { CivicAuthButton } from "@/app/components/ui/CivicAuthButton";
import { useUser } from '@civic/auth/react';
import { useState } from "react";
import Link from 'next/link';

export function NavbarDemo() {
  const { user } = useUser();
  
  const baseNavItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",

    },
    {
      name: "Map",
      link: "/mapping",
    },
    {
      name: "Onboarding",
      link: "/worker-onboarding",
    },
  ];

  const navItems = baseNavItems; // Remove Profile from navItems, keep only the separate Profile link

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <div className="flex-1"></div> {/* Left spacer */}
        <NavItems items={navItems} className="justify-center" />
        <div className="flex-1 flex justify-end"> {/* Right side with Profile and Login/Logout */}
          {user && (
            <Link href="/profile"
                  className="px-3 sm:px-4 py-2 rounded-md text-sm font-semibold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center
                             bg-transparent border-none shadow-none text-black hover:bg-yellow-200"
            >
              Profile
            </Link>
          )}
          <CivicAuthButton />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`relative text-black hover:text-yellow-600 hover:bg-yellow-100 transition-colors duration-200 py-2 border-b border-gray-100 last:border-b-0 w-full ${item.className || ''}`}
            >
              <span className="block text-base font-medium">{item.name}</span>
            </a>
          ))}
          {user && (
            <Link href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-black hover:text-yellow-600 hover:bg-yellow-100 transition-colors duration-200 py-2 border-b border-gray-100 last:border-b-0 w-full
                             bg-transparent border-none shadow-none text-black hover:bg-yellow-100"
            >
              <span className="block text-base font-medium">Profile</span>
            </Link>
          )}
          <div className="flex w-full flex-col gap-3 pt-4">
            <div className="w-full text-center">
              <CivicAuthButton />
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
