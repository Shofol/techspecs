import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import RecursiveComponent from "./RecursiveComponent";
import { useFormik } from "formik";
import Loader from "../Loader/Loader";

const SpecForm = forwardRef(
  (
    {
      schema,
      images,
      selectedCategory,
      selectedBrand,
      model,
      version,
      clearData,
    }: {
      schema: any;
      images: String[];
      selectedCategory: String;
      selectedBrand: String;
      model: String;
      version: String;
      clearData: Function;
    },
    ref
  ) => {
    const [finalData, setFinalData] = useState(schema);
    const [shchemaData, setshchemaData] = useState(schema);
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      handleCancel() {
        handleCancel();
      },
      handleSubmit() {
        formik.submitForm();
      },
    }));

    useEffect(() => {
      if (selectedBrand !== "") {
        formik.setFieldValue("Brand", selectedBrand);
      }
    }, [selectedBrand]);

    useEffect(() => {
      if (selectedCategory !== "") {
        formik.setFieldValue("Category", selectedCategory);
      }
    }, [selectedCategory]);

    useEffect(() => {
      if (model !== "") {
        formik.setFieldValue("Model", model);
      }
    }, [model]);

    useEffect(() => {
      if (version !== "") {
        formik.setFieldValue("Version", version);
      }
    }, [version]);

    useEffect(() => {
      Object.keys(schema.Image).map((key) => (schema.Image[`${key}`] = ""));
      if (images.length > 0) {
        const imageEntries = Object.keys(schema.Image);
        for (let i = 0; i < images.length; i++) {
          schema.Image[`${imageEntries[i]}`] = images[i];
          formik.setFieldValue(imageEntries[i], images[i]);
        }
        setTimeout(() => {
          Object.entries(formik.values).map((entry) => {
            updateObject(entry[0], entry[1], schema);
          });
          const tempSchema = { ...schema };
          setshchemaData(tempSchema);
        }, 200);
      }
    }, [images]);

    const handleCancel = () => {
      setLoading(true);
      formik.resetForm();

      setshchemaData({});
      setTimeout(() => {
        setshchemaData(schema);
      });
      setFinalData(schema);
      clearData();
      setLoading(false);
    };

    useEffect(() => {
      setTimeout(() => {
        console.log(formik.initialValues);
      }, 300);
    }, [schema]);

    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        Brand: "",
        Category: "",
        Model: "",
        Version: "",
        ...Object.keys(schema.Image).reduce(function (
          result: any,
          key: string
        ) {
          result[key] = "";
          return result;
        },
        {}),
      },
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
      <form method="post" onSubmit={formik.handleSubmit}>
        <Loader showLoader={loading} />
        <div className="bg-white pb-6 rounded-bl-md rounded-br-md">
          <RecursiveComponent data={shchemaData} formik={formik} />
        </div>
        <div className="flex justify-end my-6 ">
          <div>
            <button
              type="button"
              className="text-xs px-6 py-3"
              onClick={handleCancel}
            >
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
  }
);

export default SpecForm;
