import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store/store";
import AppRouter from "./app/router";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { registerForceLogout } from "./api/axiosInstance";


// Wire the axios interceptor's logout callback into the Redux store
// without creating a circular import through the auth slice.
registerForceLogout(() => {
  store.dispatch({ type: "auth/logout" });
});

// Apply the persisted theme before the first paint to avoid flash.
const savedTheme = localStorage.getItem("nourishnet_theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppRouter />
        <Toaster
          position="top-right"
          gutter={10}
          containerStyle={{ top: 72 }}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              padding: "12px 16px",
              boxShadow:
                "0 4px 24px -6px rgba(15,23,42,0.14), 0 0 0 1px rgba(15,23,42,0.06)"
            }
          }}
        />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
