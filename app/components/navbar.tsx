import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <>
      <nav className="flex flex-col">
        <Link href="/" className="text-white">
          Dashboard
        </Link>
        <Link href="/" className="my-5 text-white">
          Projects
        </Link>
        <Link href="/" className="text-white">
          Tasks
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
