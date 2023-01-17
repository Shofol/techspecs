import React, { useRef, useState } from "react";
import Image from "next/image";
import TooltipCheckbox from "./TooltipCheckbox";

const RecursiveComponent = ({ data, formik }: { data: any; formik: any }) => {
  const handleShow = (e: any, key: any) => {
    e.preventDefault();
    if (document.getElementById(`${key}`) !== null) {
      const state: any = document.getElementById(`${key}`);
      state.style.display =
        state.style.display === "none" || state.style.display === ""
          ? "block"
          : "none";

      const plusIcon: any = document.getElementById(`button-expand-${key}`);
      const minusIcon: any = document.getElementById(`button-close-${key}`);

      setTimeout(() => {
        plusIcon.style.display =
          state.style.display === "none" || state.style.display === ""
            ? "block"
            : "none";

        minusIcon.style.display =
          state.style.display === "none" || state.style.display === ""
            ? "none"
            : "block";
      }, 200);
    }
  };

  return (
    <div>
      {Object.keys(data).map((key) => {
        return (
          <div key={key} className="text-sm">
            <div>
              {typeof data[key] !== "object" &&
                data[key] !== null &&
                key !== "type" &&
                key !== "category" &&
                key !== "language" &&
                key !== "id" && (
                  <div className="flex py-6 border-b border-x border-deepest-gray">
                    <div className="flex flex-col flex-1">
                      <div className="flex-1 border border-deepest-gray rounded-sm ml-4 mr-2  flex items-center">
                        <span className="pl-3">{key}</span>
                      </div>
                      <TooltipCheckbox />
                    </div>

                    <div className="flex flex-col flex-1">
                      <div className=" border border-deepest-gray rounded-sm ml-2 mr-4">
                        <input
                          type="text"
                          name={key}
                          className="p-2 w-full placeholder:text-deep-gray"
                          placeholder={`Enter ${key}`}
                          onChange={formik.handleChange}
                          value={formik.values[`"${key}"`]}
                        />
                      </div>
                      <TooltipCheckbox />
                    </div>
                  </div>
                )}
              {typeof data[key] === "object" && data[key] !== null && (
                <div className="px-10 mb-2">
                  <div className="pt-6">
                    <div className="pl-4 rounded-sm border border-deepest-gray bg-med-gray w-full cursor-pointer flex justify-between">
                      <div className="py-3 w-1/2">
                        <div className="bg-white border border-deep-gray h-12 flex items-center">
                          <span className="pl-3">{key}</span>
                        </div>
                      </div>
                      <div className="flex">
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
                        <div className="flex flex-col justify-center items-center border-r border-deep-gray">
                          <div className="border-b border-deep-gray px-5 flex flex-col justify-center items-center flex-1">
                            <button>
                              <Image
                                src="/arrow_drop_down.svg"
                                alt="delete"
                                width={20}
                                height={20}
                              />{" "}
                            </button>
                          </div>
                          <div className="px-5 flex flex-col justify-center items-center flex-1">
                            <button>
                              <img
                                src="/arrow_drop_down_2.svg"
                                alt="delete"
                                width={20}
                                height={20}
                              />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-center items-center px-5">
                          <button onClick={(e) => handleShow(e, key)}>
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
                    <RecursiveComponent data={data[key]} formik={formik} />
                  </div>
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
