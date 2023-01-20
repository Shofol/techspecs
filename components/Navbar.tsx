import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loader from "./Loader/Loader";

const Navbar = () => {
  const [schema, setSchema] = useState<any>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchema = async () => {
    setIsLoading(true);
    let res: any = await fetch("/api/schema", {
      method: "GET",
    });
    res = await res.json();
    const obj = res.data[0].data;
    setSchema(obj);
    setIsLoading(false);
  };

  useEffect(() => {
    if (schema) {
      createNewProduct();
    }
  }, [schema]);

  const createNewProduct = async () => {
    delete schema.language;
    delete schema.type;
    delete schema.category;
    try {
      setIsLoading(true);
      let res: any = await fetch("/api/specs", {
        method: "POST",
        body: JSON.stringify({
          value: schema,
        }),
      });
      res = await res.json();
      setIsLoading(false);
      router.push(`/add?id=${res._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex bg-dark-blue text-white justify-between py-10 px-10">
      <Loader showLoader={isLoading} />

      <div className="flex flex-1 items-center">
        <Link href="/">
          <img src="/logo.svg" alt="" width="140px" />
        </Link>
        <div className="flex items-center px-20 text-sm">
          <Link className="pr-8 opacity-60 hover:opacity-100" href="/products">
            All Products
          </Link>
          <Link className="pr-8 opacity-60 hover:opacity-100" href="/brands">
            All Brands
          </Link>
          <Link
            className="pr-8 opacity-60 hover:opacity-100"
            href="/categories"
          >
            All Categories
          </Link>
          <button
            className="pr-8 opacity-60 hover:opacity-100"
            onClick={fetchSchema}
          >
            Add a product
          </button>
          <Link className="pr-8 opacity-60 hover:opacity-100" href="/schema">
            Manage Schema
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
