import { BrowserRouter as Router } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 100000000 }}
        toastOptions={{
          duration: 3000,
          className:
            "dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700",
          style: {
            borderRadius: "10px",
            background: document.documentElement.classList.contains("dark")
              ? "#1f2937"
              : "#fff",
            color: document.documentElement.classList.contains("dark")
              ? "#fff"
              : "#1f2937",
          },
        }}
      />
      <AppRoutes />
    </Router>
  );
}
