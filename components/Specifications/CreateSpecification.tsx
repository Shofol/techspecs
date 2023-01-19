import React, { useEffect, useRef, useState } from "react";
import SpecForm from "./SpecForm";
import Loader from "../Loader/Loader";
import { useRouter } from "next/router";

const CreateSpecification = () => {
  const [schema, setSchema] = useState<any>(null);
  // const [brands, setBrands] = useState([]);
  // const [categories, setCategories] = useState([]);
  // const [showCategories, setShowCategories] = useState(false);
  // const [showBrands, setShowBrands] = useState(false);

  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [selectedBrand, setSelectedBrand] = useState("");
  // const [model, setModel] = useState<any>(undefined);
  // const [version, setVersion] = useState<any>(undefined);

  const [loading, setLoading] = useState(false);
  const modelRef = useRef<any>(null);
  const versionRef = useRef<any>(null);
  const router: any = useRouter();
  const isSchemaPage = router.pathname === "/schema";
  const formRef = useRef<any>();

  useEffect(() => {
    if (router) {
      fetchSchema();
    }
    // fetchBrands();
    // fetchCategories();
  }, [router]);

  // const fetchBrands = async () => {
  //   let res: any = await fetch("/api/brands", {
  //     method: "GET",
  //   });
  //   res = await res.json();
  //   setBrands(res.data);
  //   setSelectedBrand(res.data[0]._id);
  // };

  // const fetchCategories = async () => {
  //   let res: any = await fetch("/api/categories", {
  //     method: "GET",
  //   });
  //   res = await res.json();
  //   setCategories(res.data);
  //   setSelectedCategory(res.data[0]._id);
  // };

  const fetchSchema = async () => {
    if (isSchemaPage) {
      let res: any = await fetch("/api/schema", {
        method: "GET",
      });
      res = await res.json();
      const obj = res.data[0].data;
      setSchema(obj);
    } else {
      const id = router.query.id;
      let res: any = await fetch(`/api/specification?id=${id}`, {
        method: "GET",
      });
      res = await res.json();
      const obj = res.data;
      console.log(obj);
      setSchema(obj);
    }
  };

  // const handleCategoryClick = () => {
  //   setTimeout(() => {
  //     setShowCategories(!showCategories);
  //   }, 100);
  // };

  // const handleBrandsClick = () => {
  //   setTimeout(() => {
  //     setShowBrands(!showBrands);
  //   }, 100);
  // };

  const clearData = () => {
    // setSelectedBrand("");
    // setSelectedCategory("");
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
              onClick={() => formRef.current.handleSubmit()}
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
          <div>
            {schema && (
              <SpecForm
                schema={schema}
                // selectedCategory={selectedCategory}
                // selectedBrand={selectedBrand}
                // model={model}
                // version={version}
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
