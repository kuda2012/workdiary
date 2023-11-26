import React, { useState, useEffect } from "react";

import { Navbar as ReactNavBar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
const NavBar = ({ openHowToModal }) => {
  return (
    <>
      <ReactNavBar color="light" className="navbar-expand-lg">
        <NavbarBrand>
          <NavLink
            to="#"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Work Diary
          </NavLink>
        </NavbarBrand>
        <Nav navbar className="me-auto">
          <NavItem>
            <NavLink
           to="#"
              onClick={(e) => {
                e.preventDefault();
                openHowToModal();
              }}
            >
              About
            </NavLink>
          </NavItem>
        </Nav>
      </ReactNavBar>
    </>
  );
};

export default NavBar;
