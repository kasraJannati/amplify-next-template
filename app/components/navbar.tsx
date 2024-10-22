import Link from "next/link";
import React from "react";
import { GrTasks } from "react-icons/gr";
import { FaProjectDiagram } from "react-icons/fa";
const Navbar = () => {
  return (
    <>
      <nav className="flex flex-col">
        <Link
          href="/"
          className="my-5 text-black flex items-center"
          title="Projects"
        >
          <FaProjectDiagram className="mr-2" />
          <span>Projects</span>
        </Link>
        {/* <Link
          href="/tasks"
          className="text-black flex items-center"
          title="Tasks"
        >
          <GrTasks className="mr-2" />
          <span>Tasks</span>
        </Link> */}
      </nav>
    </>
  );
};

export default Navbar;
