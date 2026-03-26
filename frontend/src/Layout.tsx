import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Todo App
      </h1>

      <Outlet />
    </div>
  );
}

export default Layout;