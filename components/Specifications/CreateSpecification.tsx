import React, { useEffect, useRef, useState } from "react";
import SpecForm from "./SpecForm";
import Loader from "../Loader/Loader";
import { useRouter } from "next/router";

const CreateSpecification = () => {
  const [schema, setSchema] = useState<any>(null);
  const router: any = useRouter();
  const isSchemaPage = router.pathname === "/schema";

  useEffect(() => {
    if (router.isReady) {
      fetchSchema();
    }
  }, [router.isReady]);

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

  return (
    <>
      <div className="flex-1">{schema && <SpecForm schema={schema} />}</div>
    </>
  );
};

export default CreateSpecification;
