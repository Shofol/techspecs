import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex bg-dark-blue text-white justify-between py-10 px-10">
      <div className="flex flex-1 items-center">
        <Link href="/">
          <img src="/logo.svg" alt="" width="140px" />
        </Link>
        <div className="flex items-center px-20 text-sm">
          <Link className="pr-8 opacity-60 hover:opacity-100" href="">
            Catalog
          </Link>
          <Link className="pr-8 opacity-60 hover:opacity-100" href="">
            Requests
          </Link>
          <Link className="pr-8 opacity-60 hover:opacity-100" href="">
            Analytics
          </Link>
          <Link className="pr-8 opacity-60 hover:opacity-100" href="">
            Sharing tool
          </Link>
          <Link className="pr-8 opacity-60 hover:opacity-100" href="">
            Users and Roles
          </Link>
          <Link className="opacity-60" href="">
            Settings
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <button>
          <img
            src="/notification.svg"
            alt="notification icon"
            width="20px"
            height="20px"
          />
        </button>
        <div className="pl-6 px-5">
          <p className="text-sm">Timothy</p>
          <p className="text-xs opacity-60">Admin</p>
        </div>
        <img
          src="/Bitmap.png"
          alt="user image"
          className="w-12 h-12 rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
