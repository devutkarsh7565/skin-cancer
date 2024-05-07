import toast from "react-hot-toast";

export type ToastType = {
  id: string;
  // other properties specific to your library
  // ...
};

const successToast = (message: string, isDarkMode?: boolean) => {
  toast.success(message, {
    style: {
      borderRadius: "10px",
      background: "rgba(255, 255, 255,0.4)",
      backdropFilter: "blur(4px)",
      color: "#0A0A0A",
      border: "1px solid rgba(165, 180, 252,0.2)",
    },
    iconTheme: {
      primary: "#4ade80",
      secondary: "#FFFAEE",
    },
  });
};

const errorToast = (message: string, isDarkMode?: boolean) => {
  toast.error(message, {
    style: {
      borderRadius: "10px",
      background: "rgba(255, 255, 255,0.4)",
      backdropFilter: "blur(4px)",
      color: "#0A0A0A",
      border: "1px solid rgba(165, 180, 252,0.2)",
    },
    iconTheme: {
      primary: "#ef4444",
      secondary: "#FFFAEE",
    },
  });
};

const warningToast = (message: string, isDarkMode?: boolean) => {
  toast(message, {
    style: {
      borderRadius: "10px",
      background: "blue",
      backdropFilter: "blur(4px)",
      color: "#0A0A0A",
      border: "1px solid rgba(165, 180, 252,0.2)",
    },
    icon: "⚠️",
  });
};

const useToast = () => {
  return {
    successToast,
    errorToast,
    warningToast,
  };
};
export default useToast;
