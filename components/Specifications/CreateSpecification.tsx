import React, { useEffect, useRef, useState } from "react";
import RecursiveComponent from "./RecursiveComponent";
import Image from "next/image";
import SpecForm from "./SpecForm";
import { useS3Upload, getImageData } from "next-s3-upload";
import Loader from "../Loader/Loader";

const CreateSpecification = () => {
  useEffect(() => {
    fetchSchema();
    fetchBrands();
    fetchCategories();
  }, []);

  const [schema, setSchema] = useState<any>(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showBrands, setShowBrands] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [model, setModel] = useState<any>(undefined);
  const [version, setVersion] = useState<any>(undefined);

  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<String[]>([]);
  const [imageLimit, setImageLimit] = useState(0);
  const [showImageListPreview, setShowImageListPreview] = useState(false);
  const modelRef = useRef<any>(null);
  const versionRef = useRef<any>(null);

  const formRef = useRef<any>();

  const handleFileChange = async (file: File) => {
    setLoading(true);
    let { url }: { url: string } = await uploadToS3(file);
    setImages([...images, url]);
    setLoading(false);
  };

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

  const deleteImage = (imgUrl: String) => {
    if (images.length > 0) {
      setImages(images.filter((image) => image !== imgUrl));
    }
  };

  useEffect(() => {
    if (schema) {
      setImageLimit(Object.keys(schema.Image).length);
    }
  }, [schema]);

  const clearData = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setImages([]);
    modelRef.current.value = "";
    versionRef.current.value = "";
  };

  return (
    <>
      <Loader showLoader={loading} />
      <div className="flex-1">
        <div className="flex justify-between text-white bg-dark-blue px-10 pt-10 pb-28">
          <h1 className="text-xl">Adding a new specification</h1>
          <div>
            <button
              className="text-xs px-6 py-3"
              onClick={() => {
                formRef.current.handleCancel();
                clearData();
              }}
            >
              CANCEL
            </button>
            <button
              className="bg-blue text-xs px-6 py-3 mr-6"
              // onClick={handleCancel}
            >
              PREVIEW
            </button>
            <button
              className="bg-lime text-xs px-6 py-3"
              onClick={() => formRef.current.handleSubmit()}
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
                defaultValue={model}
                ref={modelRef}
                onBlur={(e) => {
                  setModel(e.target.value);
                }}
              />
            </div>

            <div className="flex-1 flex items-center  px-5 border-r border-r-deep-gray h-16">
              <input
                type="text"
                className="border-0 outline-none placeholder:text-lighter-gray"
                placeholder="Version (Optional)"
                defaultValue={version}
                ref={versionRef}
                onBlur={(e) => {
                  setVersion(e.target.value);
                }}
              />
            </div>

            <div className="flex justify-center items-center relative">
              <span className="text-light-blue px-5">
                {schema && (
                  <div className="flex items-center">
                    <span className="mr-1">
                      {images.length}/{imageLimit} images added,
                    </span>
                    {images.length < imageLimit && (
                      <button className="text-link" onClick={openFileDialog}>
                        upload more
                      </button>
                    )}
                    {images.length > 0 && (
                      <Image
                        src={`${images[images.length - 1]}`}
                        width={40}
                        height={40}
                        alt="new image"
                        className="ml-2"
                      />
                    )}
                    <button
                      className="ml-2"
                      onClick={() => {
                        setShowImageListPreview(!showImageListPreview);
                      }}
                    >
                      <Image
                        src="/plus.svg"
                        width={17}
                        height={17}
                        alt="new image"
                      />
                    </button>
                  </div>
                )}
                <FileInput onChange={handleFileChange} />
                <div
                  className={
                    "bg-white absolute top-16 flex flex-wrap border w-80 border-deep-gray right-0 max-w-xs shadow-lg p-5 " +
                    (showImageListPreview ? "flex" : "hidden")
                  }
                >
                  {images.length > 0 &&
                    images.map((imageUrl: any) => {
                      return (
                        <div
                          key={imageUrl}
                          className="border border-deep-gray rounded-md w-24 h-24 flex justify-center items-center mr-3 mb-3"
                        >
                          <div className="relative w-20 h-20">
                            <Image
                              src={imageUrl}
                              fill
                              style={{ objectFit: "contain" }}
                              alt="new image"
                            />
                            <button
                              className="absolute -top-3 -right-3"
                              onClick={() => deleteImage(imageUrl)}
                            >
                              <Image
                                src="/close.svg"
                                width={16}
                                height={16}
                                alt="new image"
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  {images.length < imageLimit && (
                    <button
                      className="border border-deep-gray bg-mild-gray rounded-md w-24 h-24 flex justify-center items-center  mb-3"
                      onClick={openFileDialog}
                    >
                      <Image
                        src="/plus.svg"
                        width={15}
                        height={15}
                        alt="new image"
                      />
                    </button>
                  )}
                </div>
              </span>
            </div>
          </div>
          <div>
            {schema && (
              <SpecForm
                schema={schema}
                images={images}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                model={model}
                version={version}
                ref={formRef}
                clearData={clearData}
              />
            )}
          </div>
          {/* <div className="-my-15 mx-10">{schema && container()}</div> */}
        </div>
      </div>
    </>
  );
};

export default CreateSpecification;
