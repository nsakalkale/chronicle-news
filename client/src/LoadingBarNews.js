import React, { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import { useLocation } from "react-router-dom";

const LoadingBarNews = ({ children }) => {
  const loadingBar = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => {
      if (loadingBar.current) {
        loadingBar.current.continuousStart();
      }
    };

    const handleComplete = () => {
      if (loadingBar.current) {
        loadingBar.current.complete();
      }
    };

    handleStart();
    handleComplete();
  }, [location]);

  return (
    <>
      <LoadingBar color="#00C8B1" height={4} shadow={true} ref={loadingBar} />
      {children}
      <style jsx global>{`
        #nprogress .bar {
          background: linear-gradient(to right, #00c8b1, #7b68ee) !important;
        }
      `}</style>
    </>
  );
};

export default LoadingBarNews;
