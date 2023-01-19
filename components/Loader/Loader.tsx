import React, { useEffect, useState } from "react";
import Image from "next/image";

const Loader = ({ showLoader }: { showLoader: boolean }) => {
  //   const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    if (showLoader) {
      document.body.style.maxHeight = "100vh";
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.maxHeight = "auto";
      document.body.style.overflowY = "scroll";
    }
  }, [showLoader]);

  return (
    <>
      {showLoader && (
        <div className=" z-10 w-screen h-screen fixed top-0 left-0 after:content-[''] after:left-0 after:top-0 after:w-full after:h-full after:opacity-60 after:bg-white after:absolute flex justify-center items-center">
          <Image src="/spinner.gif" width={100} height={100} alt="spinner" />
        </div>
      )}
    </>
  );
};

export default Loader;
