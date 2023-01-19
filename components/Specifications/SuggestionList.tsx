import React from "react";

const SuggestionList = ({
  condition,
  list,
  setValue,
}: {
  condition: boolean;
  list: any;
  setValue: Function;
}) => {
  return (
    <>
      {/* {list.values.length > 0 && ( */}
      <div className="absolute top-10 right-0 left-0 border-t border-med-gray z-10">
        <ul
          className={
            "bg-white list-none max-h-36 overflow-y-scroll " +
            (condition ? "opacity-100" : "opacity-0")
          }
        >
          {list.values.map((entry: any) => {
            return (
              <li
                key={entry}
                className="py-2 hover:bg-light-gray px-5 cursor-pointer"
                role="button"
                onClick={() =>
                  setTimeout(() => {
                    setValue(list.key, entry);
                  }, 100)
                }
              >
                {entry}
              </li>
            );
          })}
        </ul>
      </div>
      {/* )} */}
    </>
  );
};

export default SuggestionList;
