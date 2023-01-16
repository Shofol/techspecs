import React, { useEffect, useState } from "react";
import RecursiveComponent from "./RecursiveComponent";

const CreateSpecification = () => {
  useEffect(() => {
    fetchSchema();
  }, []);

  const [schema, setSchema] = useState(null);

  const fetchSchema = async () => {
    let res: any = await fetch("/api/schema", {
      method: "GET",
    });
    res = await res.json();
    const obj = res.data[0].data;
    setSchema(obj);
    // console.log(res.data[0].data);
    // container(obj);
    // console.log(res);
  };

  //   useEffect(() => {
  //     renderElement(flattenObj(schema));
  //   }, [schema]);

  //     const renderElement = (obj) => {

  //       return<>
  //         <div className="flex flex-col">{
  //              //     let elementContainer: any = parent;
  //   //     Object.keys(obj).forEach((key) => {
  //   //       //   console.log(`key: ${key}, value: ${obj[key]}`);
  //   //       if (typeof obj[key] !== "object" && obj[key] !== null) {
  //   //         elementContainer = (
  //   //           <>
  //   //             {elementContainer}
  //   //             <input placeholder={obj[key]}></input>
  //   //           </>
  //   //         );
  //   //       }
  //         }</div>
  //       </>
  //     };

  //   const iterate = (obj, parent) => {
  //     let elementContainer: any = parent;
  //     Object.keys(obj).forEach((key) => {
  //       //   console.log(`key: ${key}, value: ${obj[key]}`);
  //       if (typeof obj[key] !== "object" && obj[key] !== null) {
  //         elementContainer = (
  //           <>
  //             {elementContainer}
  //             <input placeholder={obj[key]}></input>
  //           </>
  //         );
  //       }
  //       if (typeof obj[key] === "object" && obj[key] !== null) {
  //         // elementContainer = (
  //         //   <>
  //         //     {elementContainer}
  //         //     <p>{JSON.stringify(obj[key])}</p>
  //         //   </>
  //         // );
  //         iterate(obj[key], elementContainer);
  //       }
  //     });
  //     return elementContainer;
  //   };

  const handleCancel = () => {};
  //   const iterate = (obj) => {
  //     Object.keys(obj).forEach(key => {

  //     console.log(`key: ${key}, value: ${obj[key]}`)

  //     if (typeof obj[key] === 'object' && obj[key] !== null) {
  //             iterate(obj[key])
  //         }
  //     })
  // }

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
        {schema && <RecursiveComponent data={schema} />}
        {/* <div className="-my-15 mx-10">{schema && container()}</div> */}
      </div>
    </>
  );
};

export default CreateSpecification;
