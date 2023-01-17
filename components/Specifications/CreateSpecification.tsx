import React, { useEffect, useState } from "react";
import RecursiveComponent from "./RecursiveComponent";
import Image from "next/image";
import SpecForm from "./SpecForm";

const CreateSpecification = () => {
  useEffect(() => {
    fetchSchema();
    fetchBrands();
    fetchCategories();
  }, []);

  const [schema, setSchema] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showBrands, setShowBrands] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const fetchBrands = async () => {
    let res: any = await fetch("/api/brands", {
      method: "GET",
    });
    res = await res.json();
    setBrands(res.data);
    setSelectedBrand(res.data[0]._id);
  };

  const fetchCategories = async () => {
    let res: any = await fetch("/api/categories", {
      method: "GET",
    });
    res = await res.json();
    setCategories(res.data);
    setSelectedCategory(res.data[0]._id);
  };

  const fetchSchema = async () => {
    let res: any = await fetch("/api/schema", {
      method: "GET",
    });
    res = await res.json();
    const obj = res.data[0].data;
    setSchema(obj);
  };
  const handleCancel = () => {};

  const handleCategoryClick = () => {
    setTimeout(() => {
      setShowCategories(!showCategories);
    }, 100);
  };

  const handleBrandsClick = () => {
    setTimeout(() => {
      setShowBrands(!showBrands);
    }, 100);
  };

  return (
    <>
      <div className="flex-1">
        <div className="flex justify-between text-white bg-dark-blue px-10 pt-10 pb-28">
          <h1 className="text-xl">Adding a new specification</h1>
          <div>
            <button className="text-xs px-6 py-3" onClick={handleCancel}>
              CANCEL
            </button>
            <button
              className="bg-blue text-xs px-6 py-3 mr-6"
              onClick={handleCancel}
            >
              PREVIEW
            </button>
            <button
              className="bg-lime text-xs px-6 py-3"
              //   onClick={deleteSelectedRows}
            >
              SAVE SPECIFICATION
            </button>
          </div>
        </div>
        <div className=" text-light-blue max-w-screen rounded-sm mx-10 -mt-15">
          <div className="flex justify-between border-b border-b-deep-gray bg-white rounded-tl-md rounded-tr-md">
            <div className="relative flex-1 flex items-center border-r border-r-deep-gray h-16 ">
              <div className="flex justify-between items-center px-5 w-full">
                <span className="pr-10">{selectedCategory}</span>
                <button>
                  <Image
                    src="/plus.svg"
                    width={16}
                    height={16}
                    alt="choose category"
                    onClick={handleCategoryClick}
                  />
                </button>
              </div>
              <div className="absolute top-16 right-0 left-0 border-t border-med-gray pb-6">
                <ul
                  className={
                    "bg-white list-none " +
                    (showCategories ? "opacity-100" : "opacity-0")
                  }
                >
                  {categories.length > 0 &&
                    categories.map((category: any) => {
                      return (
                        <li
                          key={category._id}
                          className="py-2 hover:bg-light-gray px-5 cursor-pointer"
                          role="button"
                          onClick={() =>
                            setTimeout(() => {
                              setSelectedCategory(category._id);
                              setShowCategories(false);
                            }, 100)
                          }
                        >
                          {category._id}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>

            <div className="relative flex-1 flex items-center border-r border-r-deep-gray h-16">
              <div
                className="flex justify-between items-center px-5 w-full"
                onClick={handleBrandsClick}
              >
                <span className="pr-10">{selectedBrand}</span>
                <button>
                  <Image
                    src="/plus.svg"
                    width={16}
                    height={16}
                    alt="choose category"
                  />
                </button>
              </div>
              <div className="absolute top-16 right-0 left-0 border-t border-med-gray ">
                <ul
                  className={
                    "bg-white list-none max-h-36 overflow-y-scroll " +
                    (showBrands ? "opacity-100" : "opacity-0")
                  }
                >
                  {brands.map((brand: any) => {
                    return (
                      <li
                        key={brand._id}
                        className="py-2 hover:bg-light-gray px-5 cursor-pointer"
                        role="button"
                        onClick={() =>
                          setTimeout(() => {
                            setSelectedBrand(brand._id);
                            setShowBrands(false);
                          }, 100)
                        }
                      >
                        {brand._id}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="flex-1  px-5 h-16 border-r border-r-deep-gray">
              <input
                type="text"
                className="border-0 outline-none placeholder:text-lighter-gray h-16"
                placeholder="Enter Device Name"
              />
            </div>

            <div className="flex-1 flex items-center  px-5 border-r border-r-deep-gray h-16">
              <input
                type="text"
                className="border-0 outline-none placeholder:text-lighter-gray"
                placeholder="Version (Optional)"
              />
            </div>
          </div>
          <div>{schema && <SpecForm schema={schema} />}</div>
          {/* <div className="-my-15 mx-10">{schema && container()}</div> */}
        </div>
      </div>
    </>
  );
};

export default CreateSpecification;
