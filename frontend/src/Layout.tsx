import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout-container">
      <h1 className="app-title">TODO APP</h1>
      <Outlet />
    </div>
  );
}

export default Layout;