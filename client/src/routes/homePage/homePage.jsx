import { useContext, useEffect } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  // Add animation effect when component mounts
  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-on-load');
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('visible');
        }, index * 200);
      });
    };

    animateElements();
  }, []);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title animate-on-load">
            Find Your <span>Perfect Home</span> with Easy Rentals
          </h1>
          <p className="animate-on-load">
            Discover thousands of rental properties and homes for sale in your area.
            Easy Rentals makes finding your next home simple, fast, and stress-free.
            Start your search today and move into your dream home tomorrow!
          </p>
          <div className="animate-on-load">
            <SearchBar />
          </div>
          <div className="cta-buttons animate-on-load">
            <Link to="/list" className="browse-btn">Browse Properties</Link>
            {!currentUser && <Link to="/register" className="signup-btn">Sign Up Free</Link>}
          </div>
          <div className="boxes">
            <div className="box animate-on-load">
              <h1>10K+</h1>
              <h2>Happy Customers</h2>
            </div>
            <div className="box animate-on-load">
              <h1>5K+</h1>
              <h2>Properties Listed</h2>
            </div>
            <div className="box animate-on-load">
              <h1>24/7</h1>
              <h2>Customer Support</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Modern home interior" />
      </div>
    </div>
  );
}

export default HomePage;
