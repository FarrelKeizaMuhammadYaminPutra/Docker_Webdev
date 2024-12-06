import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Image, Form, Button } from "react-bootstrap";
import { FaSearch, FaBell, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logofixx.png";
import { useNavigate } from "react-router-dom";
import DropDownProfile from "./DropDownProfile";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/landingpage.css";
import "../../style/navbar.css";
import { useAuthStore } from "../../store/authStore";

const NavigationBar = () => {
  const { isAuthenticated, user, logout } = useAuthStore(); // Ambil status login dan data user dari authStore

  const handleLogout = () => {
    logout();
  };

  const [isSticky, setSticky] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleSearchBar = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      variant="dark"
      className={`navbar ${isSticky ? "sticky" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: isSticky ? "rgba(0, 0, 0, 0.9)" : "transparent",
        transition: "background-color 0.5s ease-in-out",
      }}
    >
      <Container fluid>
        <Nav className="navbar-left">
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <Image src={logo} alt="Logo" />
          </Navbar.Brand>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/all-movies?category=popular">Popular</a></li>
            <li><a href="/all-movies?category=top_rated">Top Rating</a></li>
            <li><a href="/all-movies?category=upcoming">Upcoming</a></li>
            {isAuthenticated && (
              <li><a href="/cms/input-drama">Input Drama</a></li>
            )}
          </ul>
        </Nav>

        <Nav className="navbar-right">
          <FaSearch className="icons" onClick={toggleSearchBar} />
          {showSearch && (
            <Form onSubmit={handleSearchSubmit} className="search-bar">
              <Form.Control
                type="text"
                placeholder="Search Movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form>
          )}

          {isAuthenticated ? (
            <>
              <span className="user-info">
                {user?.name} 
              </span>
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="btn-logout"
              >
                <FaSignOutAlt className="mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <DropDownProfile />
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
