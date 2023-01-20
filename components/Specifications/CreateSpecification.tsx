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

  // const [loading, setLoading] = useState(false);
  // const modelRef = useRef<any>(null);
  // const versionRef = useRef<any>(null);
  const router: any = useRouter();
  const isSchemaPage = router.pathname === "/schema";
  // const formRef = useRef<any>();

  useEffect(() => {
    if (router.isReady) {
      fetchSchema();
    }
    // fetchBrands();
    // fetchCategories();
  }, [router.isReady]);

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

  // const clearData = () => {
  //   // setSelectedBrand("");
  //   // setSelectedCategory("");
  //   modelRef.current.value = "";
  //   versionRef.current.value = "";
  // };

  return (
    <>
      {/* <Loader showLoader={loading} /> */}
      <div className="flex-1">{schema && <SpecForm schema={schema} />}</div>
    </>
  );
};

export default CreateSpecification;
