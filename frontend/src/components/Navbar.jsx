import { Navbar as ReactNavBar, Nav, NavItem } from "reactstrap";
import "../styles/Navbar.css";

const NavBar = ({ openHowToModal }) => {
  return (
    <ReactNavBar color="light" className="navbar-expand-lg">
      <Nav className="mx-auto">
        <NavItem
          className="nav-brand"
          onClick={(e) => {
            e.preventDefault();
            openHowToModal();
          }}
        >
          <img className="ms-2" src="icon24.png" />
        </NavItem>
      </Nav>
    </ReactNavBar>
  );
};

export default NavBar;
