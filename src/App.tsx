import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/admin";
import { routerConfig } from "./routers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routerConfig.map((route, index) => {
          let Layout = AdminLayout;
          if (route.layout) {
            Layout = route.layout;
          }
          const Page = route.component;
          return (
            <Route
              key={index}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
              path={route.path}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export function DefaulLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default App;
