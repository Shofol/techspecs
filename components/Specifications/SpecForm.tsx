import React, { useEffect, useState } from "react";
import RecursiveComponent from "./RecursiveComponent";
import { useFormik } from "formik";

const SpecForm = ({ schema }: { schema: any }) => {
  const [finalData, setFinalData] = useState(schema);

  const handleCancel = () => {
    formik.resetForm();
    setFinalData(schema);
  };

  const formik = useFormik({
    initialValues: {},
    enableReinitialize: true,
    onSubmit: async (values) => {
      Object.entries(values).map((entry) => {
        updateObject(entry[0], entry[1], finalData);
      });
      delete finalData.language;
      delete finalData.type;
      delete finalData.category;
      let res = await fetch("/api/specs", {
        method: "POST",
        body: JSON.stringify({
          value: finalData,
        }),
      });
      res = await res.json();
    },
  });

  const updateObject = (keyName: any, newVal: any, object: any) => {
    for (let key in object) {
      if (key === keyName && typeof object[key] !== "object") {
        object[key] = newVal;
      } else if (typeof object[key] === "object" && object[key] !== null) {
        updateObject(keyName, newVal, object[key]);
      }
    }
  };

  return (
    <form>
      <div className="bg-white pb-6 rounded-bl-md rounded-br-md">
        <RecursiveComponent data={schema} formik={formik} />
      </div>
      <div className="flex justify-end my-6 ">
        <div>
          <button className="text-xs px-6 py-3" onClick={handleCancel}>
            CANCEL
          </button>
          <button
            className="bg-blue text-xs rounded-sm px-6 py-3 mr-6 text-white"
            //   onClick={handleCancel}
          >
            PREVIEW
          </button>
          <button
            className="bg-lime text-xs rounded-sm px-6 py-3 text-white"
            type="submit"
            //   onClick={deleteSelectedRows}
          >
            SAVE SPECIFICATION
          </button>
        </div>
      </div>
    </form>
  );
};

export default SpecForm;
