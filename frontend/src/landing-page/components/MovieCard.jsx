import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import "../../style/MovieCard.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const MovieCard = ({ title, movies = [] }) => {  
  const cardsRef = useRef();
  const [hoveredIndex, setHoveredIndex] = useState(null); 

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaX; // Scroll secara horizontal
  };

  useEffect(() => {
    const refCurrent = cardsRef.current;
    if (refCurrent) {
      refCurrent.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div className="movie-cards">
      <h2>{title ? title : "Popular"}</h2>
      <div className="card-list" ref={cardsRef}>
        {movies && movies.length > 0 ? (  
          movies.slice(0, 15).map((movie, index) => {
            return (
              <div
                className="card"
                key={movie.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ position: "relative", margin: "10px" }}
              >
                <img src={movie.poster} alt={movie.title} style={{ width: "100%", borderRadius: "10px" }} />

                {hoveredIndex === index && (
                  <div className="content">
                    <Link to={`/detail/${movie.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
                      <h4>{movie.title}</h4>
                    </Link>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>Loading movies...</p>  
        )}
      </div>
    </div>
  );
};

export default MovieCard;
