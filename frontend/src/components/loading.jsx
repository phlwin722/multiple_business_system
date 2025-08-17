import { ThreeDot } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-[9999] flex items-center justify-center">    
      <ThreeDot color="#e2e1e1" size="medium" text="Loading" textColor="" />
    </div>
  )
};

export default Loading;

/* https://github.com/hane-smitter/react-loading-indicator */
