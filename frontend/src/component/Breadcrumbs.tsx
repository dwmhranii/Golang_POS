"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs: React.FC = () => {
    const pathname = usePathname(); // Get the current path
    const pathSegments = pathname.split("/").filter((segment) => segment); // Split path into segments

    return (
        <nav className="text-sm font-medium" aria-label="breadcrumbs">
            <ul className="flex items-center space-x-3">
                {/* Home Link */}
                <li>
                    <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                        Home
                    </Link>
                </li>
                {pathSegments.map((segment, index) => {
                    const breadcrumbPath = "/" + pathSegments.slice(0, index + 1).join("/");
                    const segmentLabel = segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

                    return (
                        <li key={breadcrumbPath} className="flex items-center space-x-3">
                            <span className="text-gray-400">{`>`}</span>
                            {index < pathSegments.length - 1 ? (
                                <Link href={breadcrumbPath} className="text-gray-500 hover:text-gray-700">
                                    {segmentLabel}
                                </Link>
                            ) : (
                                <span className="text-gray-700 font-semibold">{segmentLabel}</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
