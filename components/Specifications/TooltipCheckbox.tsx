import React from "react";

const TooltipCheckbox = () => {
  return (
    <div className="flex items-center my-2 text-xs pl-4">
      <input
        id="default-checkbox"
        type="checkbox"
        value=""
        // className="w-4 h-4 text-blue-600 appearance-none border border-deepest-gray rounded focus:ring-blue-500 focus:ring-2 focus:bg-blue checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain cursor-pointer"
      />
      <label
        htmlFor="default-checkbox"
        className="ml-2 text-light-blue opacity-60"
      >
        ADD TOOLTIP
      </label>
    </div>
  );
};

export default TooltipCheckbox;
