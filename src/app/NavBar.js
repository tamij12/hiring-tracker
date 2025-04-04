"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/applications", label: "Applications" },
    { href: "/job-openings", label: "Job Openings" },
    { href: "/", label: "Exit" },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md mb-6">
      <ul className="flex gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`hover:text-blue-300 transition-colors ${
                pathname === item.href ? "text-blue-400 font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
