import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TooltipCheckbox from "./TooltipCheckbox";
import { useRouter } from "next/router";
import { setConstantValue } from "typescript";
import SuggestionList from "./SuggestionList";

const RecursiveComponent = ({
  data,
  formik,
  addNewAttribute,
  searchData,
  suggestions,
  setValue,
}: {
  data: any;
  formik: any;
  addNewAttribute: Function;
  searchData: Function;
  suggestions: any;
  setValue: Function;
}) => {
  const router = useRouter();
  const isSchemaPage = router.pathname === "/schema";
  const [currentKey, setCurrentKey] = useState(null);
  const currentKeyRef = useRef<any>(null);
  const currentValueRef = useRef<any>(null);

  const handleShow = (e: any, key: any) => {
    e.preventDefault();
    if (document.getElementById(`${key}`) !== null) {
      const state: any = document.getElementById(`${key}`);
      const plusIcon: any = document.getElementById(`button-expand-${key}`);
      const minusIcon: any = document.getElementById(`button-close-${key}`);
      const addAttribure: any = document.getElementById(`new-${key}`);

      state.style.display =
        state.style.display === "none" || state.style.display === ""
          ? "block"
          : "none";

      setTimeout(() => {
        plusIcon.style.display =
          state.style.display === "none" || state.style.display === ""
            ? "block"
            : "none";
        minusIcon.style.display =
          state.style.display === "none" || state.style.display === ""
            ? "none"
            : "block";
        if (addAttribure) {
          addAttribure.style.display =
            state.style.display === "none" || state.style.display === ""
              ? "none"
              : "block";
        }
      }, 200);
    }
  };

  return (
    <div>
      {Object.keys(data).map((key: any) => {
        return (
          <div key={key} className="text-sm">
            <div>
              {typeof data[key] !== "object" &&
                data[key] !== null &&
                key !== "type" &&
                key !== "category" &&
                key !== "language" &&
                key !== "id" &&
                key !== "_id" && (
                  <div className="flex py-6 border-b border-x border-deepest-gray">
                    <div className="flex flex-col flex-1">
                      <div className="flex-1 border border-deepest-gray rounded-sm ml-4 mr-2  flex items-center">
                        <span className="pl-3">{key}</span>
                      </div>
                      {!isSchemaPage && <TooltipCheckbox />}
                    </div>

                    <div className="flex flex-col flex-1 relative">
                      <div className=" border border-deepest-gray rounded-sm ml-2 mr-4">
                        <input
                          type="text"
                          name={key}
                          className="p-2 w-full placeholder:text-deep-gray foucs:border focus:border-blue rounded-sm"
                          placeholder={`Enter ${key}`}
                          onChange={formik.handleChange(key)}
                          onKeyUp={(e: any) => {
                            searchData(e.target.value, key);
                          }}
                          value={formik.values[`${key}`]}
                          disabled={isSchemaPage && key !== "category"}
                        />
                        {suggestions.key === key && (
                          <SuggestionList
                            condition={suggestions.key === key}
                            list={suggestions}
                            setValue={setValue}
                          />
                        )}
                      </div>
                      {!isSchemaPage && <TooltipCheckbox />}
                    </div>
                  </div>
                )}
              {typeof data[key] === "object" && data[key] !== null && (
                <div className="px-10 mb-2">
                  <div className="pt-6">
                    <div
                      className="pl-4 rounded-sm border border-deepest-gray bg-med-gray w-full cursor-pointer flex justify-between"
                      onClick={(e) => handleShow(e, key)}
                    >
                      <div className="py-3 w-1/2">
                        <div className="bg-white border border-deep-gray h-12 flex items-center">
                          <span className="pl-3">{key}</span>
                        </div>
                      </div>
                      <div className="flex">
                        {isSchemaPage && (
                          <div className="border-x border-deep-gray flex justify-center items-center">
                            <button className="px-5">
                              <Image
                                src="/trash_2.svg"
                                alt="delete"
                                width={18}
                                height={18}
                              />
                            </button>
                          </div>
                        )}
                        {isSchemaPage && (
                          <div className="flex flex-col justify-center items-center border-r border-deep-gray">
                            <div className="border-b border-deep-gray px-5 flex flex-col justify-center items-center flex-1">
                              <button>
                                <Image
                                  src="/arrow_drop_down.svg"
                                  alt="expand"
                                  width={20}
                                  height={20}
                                />{" "}
                              </button>
                            </div>
                            <div className="px-5 flex flex-col justify-center items-center flex-1">
                              <button>
                                <img
                                  src="/arrow_drop_down_2.svg"
                                  alt="close"
                                  width={20}
                                  height={20}
                                />
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-center items-center px-5">
                          <button>
                            <Image
                              id={`button-expand-${key}`}
                              src="/plus-circle.svg"
                              alt="expand"
                              width={18}
                              height={18}
                            />
                            <Image
                              id={`button-close-${key}`}
                              src="/minus.svg"
                              alt="close"
                              width={18}
                              height={18}
                              className="hidden"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id={key} className="hidden">
                    <RecursiveComponent
                      data={data[key]}
                      formik={formik}
                      addNewAttribute={addNewAttribute}
                      searchData={searchData}
                      suggestions={suggestions}
                      setValue={setValue}
                    />
                  </div>
                  {isSchemaPage && (
                    <>
                      {currentKey === key && (
                        <div className="flex py-6 border-b border-x border-deepest-gray">
                          <div className="flex w-full">
                            <div className=" border border-deepest-gray rounded-sm ml-2 mr-4 flex-1">
                              <input
                                ref={currentKeyRef}
                                type="text"
                                name={key}
                                className="p-2 w-full placeholder:text-deep-gray"
                                placeholder={`Attribute Name`}
                              />
                            </div>
                            <div className=" border border-deepest-gray rounded-sm ml-2 mr-4  flex-1">
                              <input
                                ref={currentValueRef}
                                type="text"
                                name={key}
                                className="p-2 w-full placeholder:text-deep-gray"
                                placeholder={`Attribute Value`}
                              />
                            </div>
                            <button
                              className="bg-lime text-white text-xs px-4 mr-4"
                              type="button"
                              onClick={() => {
                                addNewAttribute(
                                  key,
                                  currentKeyRef.current.value,
                                  currentValueRef.current.value
                                );
                                setTimeout(() => {
                                  setCurrentKey(null);
                                }, 100);
                              }}
                            >
                              Save Attribute
                            </button>
                          </div>
                        </div>
                      )}
                      <button
                        id={`new-${key}`}
                        type="button"
                        className="w-full border-l border-l-deep-gray border-r border-r-deep-gray border-b border-b-deep-gray py-4 text-center text-cyan hidden"
                        onClick={() => {
                          setCurrentKey(key);
                        }}
                      >
                        ADD NEW ATTRIBUTE
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default RecursiveComponent;
