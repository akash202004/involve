"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";
import Link from "next/link";


interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    className?: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
      className={cn("fixed inset-x-0 top-0 z-50 min-h-0 h-auto pt-4 rounded-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04), 0 0 4px rgba(0, 0, 0, 0.08), 0 16px 68px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[9999] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-3 sm:px-4 py-5 lg:flex dark:bg-transparent border border-black min-h-0 h-auto",
        visible && "bg-white/90 dark:bg-white/90",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-black transition duration-200 hover:text-black lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn("relative px-4 py-2 rounded-lg text-sm font-semibold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center text-black hover:bg-yellow-200 hover:text-yellow-800", item.className)}
          key={`link-${idx}`}
          href={item.link}
        >
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04), 0 0 4px rgba(0, 0, 0, 0.08), 0 16px 68px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-[9999] mx-auto flex w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-5 lg:hidden border-2 border-black rounded-full min-h-0 h-auto",
        visible && "bg-white/90 dark:bg-white/90",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-[9999] flex flex-col items-start justify-start gap-4 rounded-2xl border border-black bg-white backdrop-blur-2xl shadow-md text-black max-w-7xl w-full px-2 sm:px-4 py-6 sm:py-8 mt-4 mx-auto",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="text-black pl-2" size={36} onClick={onClick} />
  ) : (
    <IconMenu2 className="text-black pl-2" size={36} onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-2 sm:mr-4 flex items-center space-x-1 sm:space-x-2 px-2 text-sm font-normal text-black"
    >
      <img
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={24}
        height={24}
        className="sm:w-[30px] sm:h-[30px]"
      />
      <span className="font-medium text-black dark:text-white text-sm sm:text-base">Startup</span>
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient" | "transparent";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-3 sm:px-4 py-2 rounded-md text-sm font-semibold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "bg-transparent text-black shadow-none hover:bg-yellow-200 hover:text-yellow-800",
    secondary: "bg-transparent text-black hover:bg-yellow-200 hover:text-yellow-800 shadow-none",
    dark: "bg-transparent text-black shadow-none hover:bg-yellow-200 hover:text-yellow-800",
    gradient:
      "bg-transparent text-black shadow-none hover:bg-yellow-200 hover:text-yellow-800",
    transparent:
      "bg-transparent border-none shadow-none text-black hover:bg-yellow-200 hover:text-yellow-800",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
