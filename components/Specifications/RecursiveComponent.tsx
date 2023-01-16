import React, { useRef, useState } from "react";

const RecursiveComponent = ({ data }: { data: any }) => {
  const handleShow = (key: any) => {
    if (document.getElementById(`${key}`) !== null) {
      const state: any = document.getElementById(`${key}`);
      state.style.display = state.style.display === "none" ? "block" : "none";
    }
  };
  return (
    <div>
      {Object.keys(data).map((key) => {
        return (
          <div key={key}>
            <div>
              {typeof data[key] !== "object" && data[key] !== null && (
                <div className="flex mb-2">
                  <div className="w-36">{key}</div>
                  <input type="text" className="py-2 w-9/12" />
                </div>
              )}
              {typeof data[key] === "object" && data[key] !== null && (
                <div className="px-10 my-2">
                  <div
                    className="px-4 py-4 bg-lime w-full cursor-pointer"
                    onClick={() => handleShow(key)}
                  >
                    {key}
                  </div>
                  <div id={key}>
                    <RecursiveComponent data={data[key]} />
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
