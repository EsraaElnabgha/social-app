import { routes } from "./AppRouting.jsx";
import { RouterProvider } from "react-router-dom";
import TokenContextProvider from "./Context/TokenContext.jsx";

function App() {
  return (
    <>
      <TokenContextProvider>
        <RouterProvider router={routes} />
      </TokenContextProvider>
    </>
  );
}

export default App;
