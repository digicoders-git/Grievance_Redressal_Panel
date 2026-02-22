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
          className: "dark:bg-gray-800 dark:text-white",
        }}
      />
      <AppRoutes />
    </Router>
  );
}
