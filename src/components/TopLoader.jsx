import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const TopLoader = () => {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <style jsx="true" global="true">{`
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
        position: fixed;
        z-index: 50;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px #3b82f6, 0 0 5px #6366f1;
        opacity: 1;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  );
};

export default TopLoader;
