import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import RecursiveComponent from "./RecursiveComponent";
import { useFormik } from "formik";
import Loader from "../Loader/Loader";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch";
import Image from "next/image";
import { useS3Upload, getImageData } from "next-s3-upload";
import SuggestionList from "./SuggestionList";

const SpecForm = forwardRef(
  (
    {
      schema,
      // images,
      // selectedCategory,
      // selectedBrand,
      // model,
      // version,
      clearData,
    }: {
      schema: any;
      // images: String[];
      // selectedCategory: string;
      // selectedBrand: string;
      // model: string;
      // version: string;
      clearData: Function;
    },
    ref
  ) => {
    const [finalData, setFinalData] = useState(schema);
    const [shchemaData, setschemaData] = useState(schema);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showSectionForm, setShowSectionForm] = useState(false);
    const [flattenedObject, setFlattenedObject] = useState<any>({});
    const initalSuggestion = { key: "", values: [] };
    const [imageLimit, setImageLimit] = useState(0);
    const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
    const [initialValues, setInitialValues] = useState(schema);

    const [suggestions, setSuggestions] = useState<{
      key: string;
      values: string[];
    }>(initalSuggestion);
    const isSchemaPage = router.pathname === "/schema";
    const client = algoliasearch(
      "VIR502HXCD",
      "8dcae4c13be840c2b71d9b6f1c2250a8"
    );
    const index = client.initIndex("test_Product");
    const [images, setImages] = useState<String[]>([]);
    const [showImageListPreview, setShowImageListPreview] = useState(false);

    const currentKeyRef = useRef<any>(null);
    const currentValueRef = useRef<any>(null);
    // fetchSearchResults = ()=>{

    // }

    // useEffect(() => {
    //   if (results && results.facetHits) {
    //     const suggestedModels = results.facetHits.map((model) => model.value);
    //     console.log(suggestedModels);
    //   }
    // }, [results]);

    useEffect(() => {
      if (schema) {
        setImageLimit(Object.keys(schema.Image).length);
      }
    }, [schema]);

    const handleFileChange = async (file: File) => {
      setLoading(true);
      let { url }: { url: string } = await uploadToS3(file);
      setImages([...images, url]);
      setLoading(false);
    };

    const deleteImage = (imgUrl: String) => {
      if (images.length > 0) {
        setImages(images.filter((image) => image !== imgUrl));
      }
    };

    useImperativeHandle(ref, () => ({
      handleCancel() {
        handleCancel();
      },
      handleSubmit() {
        formik.submitForm();
      },
    }));

    useEffect(() => {
      Object.keys(schema.Image).map((key) => (schema.Image[`${key}`] = ""));
      if (images.length > 0) {
        const imageEntries = Object.keys(schema.Image);
        for (let i = 0; i < images.length; i++) {
          schema.Image[`${imageEntries[i]}`] = images[i];
          formik.setFieldValue(imageEntries[i], images[i]);
        }
        setTimeout(() => {
          storeFormValue();
          const tempSchema = { ...schema };
          setschemaData(tempSchema);
          setFinalData(tempSchema);
        }, 200);
      }
    }, [images]);

    const storeFormValue = () => {
      Object.entries(formik.values).map((entry) => {
        updateObject(entry[0], entry[1], schema);
      });
    };

    const handleCancel = () => {
      setLoading(true);
      formik.resetForm();

      setschemaData({});
      setTimeout(() => {
        setschemaData(schema);
      });
      setFinalData(schema);
      clearData();
      setLoading(false);
    };

    useEffect(() => {
      flattenObject(schema, "", {});
      console.log(getInitialValues(schema));
      // setInitialValues(getInitialValues(schema, {}));
    }, [schema]);

    const getInitialValues = (object: any, res: any = {}) => {
      Object.keys(object).map((key) => {
        if (typeof object[key] === "object" && object[key] !== null) {
          getInitialValues(object[key], res);
        } else {
          res[key] = object[key];
        }
      });
      return res;
    };

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

        // // Brand: null,
        // // Category: null,
        // // Model: null,
        // // Version: null,
        // ...Object.keys(schema).reduce(function (result: any, key: string) {
        //   result[key] = null;
        //   return result;
        // }, {}),
      },

      onSubmit: async (values) => {
        Object.entries(values).map((entry) => {
          updateObject(entry[0], entry[1], finalData);
        });
        if (!isSchemaPage) {
          delete finalData.language;
          delete finalData.type;
          delete finalData.category;
        }
        let res = null;
        if (isSchemaPage) {
          try {
            setLoading(true);
            res = await fetch("/api/schema", {
              method: "POST",
              body: JSON.stringify({
                value: {
                  description: `Add ${finalData.category} products to database`,
                  data: finalData,
                },
              }),
            });
            res = await res.json();
            setLoading(false);
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            setLoading(true);
            res = await fetch("/api/specs", {
              method: "POST",
              body: JSON.stringify({
                value: finalData,
              }),
            });
            res = await res.json();
            setLoading(false);
          } catch (error) {
            console.log(error);
          }
        }
      },
    });

    const flattenObject = (object: any, parent: string, newObj: any = {}) => {
      Object.keys(object).map((key) => {
        let updatedPath = parent ? parent + "." + key : key;
        if (typeof object[key] == "object" && object[key] !== null) {
          flattenObject(object[key], updatedPath, newObj);
        } else {
          newObj[updatedPath] = object[key];
        }
      });
      setFlattenedObject(newObj);
    };

    const updateObject = (keyName: any, newVal: any, object: any) => {
      for (let key in object) {
        if (key === keyName && typeof object[key] !== "object") {
          object[key] = newVal;
        } else if (typeof object[key] === "object" && object[key] !== null) {
          updateObject(keyName, newVal, object[key]);
        }
      }
    };

    const addNewAttribute = (
      keyName: string,
      newName: string,
      newValue: string
    ) => {
      storeFormValue();
      Object.keys(schema).map((key) => {
        if (
          typeof schema[key] === "object" &&
          schema[key] !== null &&
          key === keyName
        ) {
          schema[key][`${newName}`] = newValue;
        }
      });
      const tempSchema = { ...schema };
      setschemaData(tempSchema);
    };

    const addNewSection = (key: string, value: string) => {
      schema[`${key}`] = value;
      const updatedSchema = { ...schema };
      setschemaData(updatedSchema);
      setFinalData(updatedSchema);
    };

    const searchData = async (value: string, keyName: string) => {
      const fullKey = getFullKey(keyName);
      try {
        const results = await index.searchForFacetValues(`${fullKey}`, value);
        if (results && results.facetHits) {
          const suggestedModels = results.facetHits.map((model) => model.value);
          const tempSuggestion = { ...suggestions };
          tempSuggestion.key = keyName;
          tempSuggestion.values = suggestedModels;
          setSuggestions(tempSuggestion);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getFullKey = (keyName: string) => {
      return Object.keys(flattenedObject).filter((key) =>
        key.includes(keyName)
      )[0];
    };

    const setValue = (key: string, value: string) => {
      formik.setFieldValue(key, value);
      storeFormValue();
      updateObject(key, value, schema);
      setSuggestions(initalSuggestion);
      const tempSchema = { ...schema };
      setschemaData(tempSchema);
    };

    return (
      <>
        <form method="post" onSubmit={formik.handleSubmit}>
          <Loader showLoader={loading} />

          {!isSchemaPage && (
            <div className="flex justify-between border-b border-b-deep-gray bg-white rounded-tl-md rounded-tr-md">
              <div className="relative flex-1 flex items-center border-r border-r-deep-gray h-16 ">
                <div className="flex justify-between items-center px-5 w-full relative">
                  <input
                    type="text"
                    name="Category"
                    className="p-2 w-full placeholder:text-deep-gray "
                    placeholder={`Enter Category`}
                    onChange={formik.handleChange}
                    onKeyUp={(e: any) => {
                      searchData(e.target.value, "Category");
                    }}
                    value={formik.values.Category}
                  />
                  {suggestions.key === "Category" && (
                    <SuggestionList
                      condition={suggestions.key === "Category"}
                      list={suggestions}
                      setValue={setValue}
                    />
                  )}
                </div>
              </div>

              <div className="relative flex-1 flex items-center border-r border-r-deep-gray h-16">
                <div className="flex justify-between items-center px-5 w-full relative">
                  <input
                    type="text"
                    name="Brand"
                    className="p-2 w-full placeholder:text-deep-gray "
                    placeholder={`Enter Brand`}
                    onChange={formik.handleChange}
                    onKeyUp={(e: any) => {
                      searchData(e.target.value, "Brand");
                    }}
                    value={formik.values.Brand}
                  />
                  {suggestions.key === "Brand" && (
                    <SuggestionList
                      condition={suggestions.key === "Brand"}
                      list={suggestions}
                      setValue={setValue}
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 flex items-center relative px-5 h-16 border-r border-r-deep-gray">
                <input
                  type="text"
                  name="Model"
                  className="p-2 w-full placeholder:text-deep-gray "
                  placeholder={`Enter Model`}
                  onChange={formik.handleChange}
                  onKeyUp={(e: any) => {
                    searchData(e.target.value, "Model");
                  }}
                  value={formik.values.Model}
                />
                {suggestions.key === "Model" && (
                  <SuggestionList
                    condition={suggestions.key === "Model"}
                    list={suggestions}
                    setValue={setValue}
                  />
                )}
              </div>

              <div className="flex-1 flex items-center relative px-5 border-r border-r-deep-gray h-16">
                <input
                  type="text"
                  name="Version"
                  className="p-2 w-full placeholder:text-deep-gray "
                  placeholder={`Enter Version`}
                  onChange={formik.handleChange}
                  onKeyUp={(e: any) => {
                    searchData(e.target.value, "Version");
                  }}
                  value={formik.values.Version}
                />
                {suggestions.key === "Version" && (
                  <SuggestionList
                    condition={suggestions.key === "Version"}
                    list={suggestions}
                    setValue={setValue}
                  />
                )}
              </div>

              <div className="flex justify-center items-center relative">
                <span className="text-light-blue px-5">
                  {schema && (
                    <div className="flex items-center">
                      <span className="mr-1">
                        {images.length}/{imageLimit} images added,
                      </span>
                      {images.length < imageLimit && (
                        <button
                          type="button"
                          className="text-link"
                          onClick={openFileDialog}
                        >
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
                        type="button"
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
          )}

          <div
            className={
              "bg-white pb-6 " +
              (isSchemaPage
                ? "rounded-tl-md rounded-tr-md"
                : "rounded-bl-md rounded-br-md")
            }
          >
            <RecursiveComponent
              data={shchemaData}
              formik={formik}
              addNewAttribute={addNewAttribute}
              searchData={searchData}
              suggestions={suggestions}
              setValue={setValue}
            />
          </div>
          {isSchemaPage && (
            <>
              {showSectionForm && (
                <div className="flex py-6 border-b border-x border-deepest-gray">
                  <div className="flex w-full">
                    <div className=" border border-deepest-gray rounded-sm ml-2 mr-4 flex-1">
                      <input
                        ref={currentKeyRef}
                        type="text"
                        className="p-2 w-full placeholder:text-deep-gray"
                        placeholder={`Attribute Name`}
                      />
                    </div>
                    <div className=" border border-deepest-gray rounded-sm ml-2 mr-4  flex-1">
                      <input
                        ref={currentValueRef}
                        type="text"
                        className="p-2 w-full placeholder:text-deep-gray"
                        placeholder={`Attribute Value`}
                      />
                    </div>
                    <button
                      className="bg-lime text-white text-xs px-4 mr-4"
                      type="button"
                      onClick={() => {
                        addNewSection(
                          currentKeyRef.current.value,
                          currentValueRef.current.value
                        );
                        setTimeout(() => {
                          setShowSectionForm(false);
                        }, 100);
                      }}
                    >
                      Save Section
                    </button>
                  </div>
                </div>
              )}
              <div
                className="w-full bg-cyan text-white text-xs py-5 text-center mb-4 rounded-bl-md rounded-br-md"
                onClick={() => setShowSectionForm(true)}
              >
                ADD NEW SECTION
              </div>
            </>
          )}
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
      </>
    );
  }
);

SpecForm.displayName = "SpecForm";

export default SpecForm;
