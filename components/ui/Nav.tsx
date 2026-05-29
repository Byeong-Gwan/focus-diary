"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/", label: "Focus Board" },
    { href: "/weekly", label: "Weekly" },
    { href: "/monthly", label: "Monthly" },
    { href: "/daily", label: "Daily" },
];

export default function Nav() {
    const pathname = usePathname();
    return (
        <nav className="bg-white border-b border-gray-200 px-8 py-3 w-full">
            <div className="flex gap-4 justify-center">
                {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                    pathname === item.href
                        ? "bg-blue-500 text-white"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                >
                    {item.label}
                </Link>
                ))}
            </div>
        </nav>
    );
}