import axios from "axios";
import { useEffect, FC } from "react";

export const Navbar: FC = () => {
    return (
        <nav>
            <ul className="navbar">
                <div className="navbarList">
                    <li>Books</li>
                    <li>Search</li>
                </div>
            </ul>
        </nav>
    )
}