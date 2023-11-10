import React, { useState, useEffect } from "react";
import {
  Navbar as ReactNavBar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getWorksnapToken,
  isWorksnapTokenCurrent,
  resetApp,
} from "../helpers/actionCreators";
import SearchBar from "./SearchBar";

const NavBar = () => {
  const dispatch = useDispatch();
  const googleAccessToken = useSelector((state) => state.google_access_token);
  const worksnapToken = useSelector((state) => state.worksnap_token);

  useEffect(() => {
    if (googleAccessToken) {
      dispatch(getWorksnapToken(googleAccessToken));
    }
  }, [googleAccessToken]);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };
  return (
    <>
      <ReactNavBar color="light" className="navbar-expand-lg">
        {worksnapToken && (
          <NavItem style={{ listStyleType: "none" }} onClick={toggleSearchBar}>
            <NavLink style={{ textDecoration: "none" }}>Search</NavLink>
          </NavItem>
        )}
        {worksnapToken && isSearchBarVisible && (
          <SearchBar toggleSearchBar={toggleSearchBar} />
        )}
        <NavbarBrand
          style={{
            fontSize: "1.5rem",
            position: "relative",
            left: `${worksnapToken ? "12px" : "0px"}`,
          }}
        >
          <NavLink to="/" style={{ textDecoration: "none" }}>
            Worksnap
          </NavLink>
        </NavbarBrand>
        {/* <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar> */}
        <Nav navbar>
          {worksnapToken && (
            <>
              <NavItem
                onClick={() => {
                  chrome.identity.removeCachedAuthToken({
                    token: googleAccessToken,
                  });
                  toggle(); // Close the menu after clicking on an item
                }}
              >
                <NavLink
                  style={{ textDecoration: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(resetApp());
                  }}
                >
                  Logout
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
        {/* </Collapse> */}
      </ReactNavBar>
    </>
  );
};
//   function toogleMenuMobile() {
//   setCollapsed(!isCollapsed);
// }

//   return (
//     <>
//       <div className="container">
//         <ReactNavBar
//           color="light"
//           className="navbar-expand-lg"
//           id="louge-navbar"
//         >
//           <NavbarBrand className="navbar-brand">
//             <NavLink to="/" style={{ textDecoration: "none" }}>
//               Worksnap
//             </NavLink>
//           </NavbarBrand>

//           <NavbarToggler onClick={toggle}>
//             {/* <BsBorderWidth size={24} color="#fff" /> */}
//           </NavbarToggler>
//           <Collapse className="navbar-collapse" navbar isOpen={isOpen}>
//             <Nav className="navbar-nav">
//               <NavItem className="active">
//                 <NavLink data-scroll href="#hero">
//                   home
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink data-scroll href="#about">
//                   about us
//                 </NavLink>
//               </NavItem>
//             </Nav>
//           </Collapse>
//         </ReactNavBar>
//       </div>
//     </>
//   );
// };

export default NavBar;
