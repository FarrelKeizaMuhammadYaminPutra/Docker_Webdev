import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation,Link } from 'react-router-dom';
import Footer from "./footer/Footer.jsx"; 
import NavigationBar from "./NavigationBar.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const AllMovie = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category'); // Mendapatkan kategori dari URL

  useEffect(() => {
    const fetchMovies = async () => {
      let endpoint = '';
      switch (category) {
        case 'popular':
          endpoint = 'http://localhost:5000/landing/movies/popular';
          break;
        case 'top_rated':
          endpoint = 'http://localhost:5000/landing/movies/top_rated';
          break;
        case 'upcoming':
          endpoint = 'http://localhost:5000/landing/movies/upcoming';
          break;
        default:
          endpoint = 'http://localhost:5000/landing/movies/popular';
          break;
      }

      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]); // Tambahkan category ke dalam dependensi effect

  return (
    <>
    <NavigationBar/>
    <div className="mySearch bg-black">
      <Container className="p-5 mt-5">
        <h1 className="mb-3" style={{ fontWeight: 'bold', color: 'white', textDecoration: 'underline' }}>
          {category ? category.toUpperCase() : "MOVIES"}
        </h1>
        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length > 0 ? (
          <Row>
            {movies.map(movie => (
              <Col key={movie.id} md={3} className="mb-3">
                <Link to={`/detail/${movie.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}> 
                    <img src={movie.poster} alt={movie.title} style={{ width: "100%", borderRadius: "10px" }} />
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="card-text">{movie.year || "Year not available"}</p>
                      <p className="card-text">{Array.isArray(movie.genres) && movie.genres.length > 0 ? movie.genres.join(", ") : "Genres not available"}</p>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No movies found.</p>
        )}
        <Footer />
      </Container>
    </div>
    </>
  );
};

export default AllMovie;
