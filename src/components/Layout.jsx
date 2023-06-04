import React from "react";

import { Fragment } from "react";
import Navbar from "./navbar/Navbar";

const Layout = ({ children, username, role }) => {
  return (
    <Fragment>
      <Navbar username={username} role={role} />
      <main className='mx-auto max-w-7xl p-4 sm:p-6 lg:p-8'>{children}</main>
    </Fragment>
  );
};

export default Layout;
