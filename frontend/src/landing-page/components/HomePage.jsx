import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import "../../style/Home.css";
import "../../style/landingpage.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight, FaPlay } from "react-icons/fa";
import MovieCard from "./MovieCard";
import Footer from "./footer/Footer.jsx";
import NavigationBar from "./NavigationBar.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchPopularMovies, fetchTopRatedMovies, fetchUpCoMovies, fetchTopMovies } from "../../utils/fetchMovie";

export const handlePlay = (url) => {
  const embedUrl = url.replace("watch?v=", "embed/");
  return {
    videoUrl: embedUrl,
    show: true,
  };
};

export const handleClose = () => ({
  videoUrl: "",
  show: false,
});

const HomePage = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [show, setShow] = useState(false);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topratedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);

  const navigate = useNavigate();

  const handlePlayWrapper = (url) => {
    const { videoUrl, show } = handlePlay(url);
    setVideoUrl(videoUrl);
    setShow(show);
  };

  const handleCloseWrapper = () => {
    const { videoUrl, show } = handleClose();
    setVideoUrl(videoUrl);
    setShow(show);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <FaArrowLeft className="slick-prev" />,
    nextArrow: <FaArrowRight className="slick-next" />,
  };

  useEffect(() => {
    const getMovies = async () => {
      const data = await fetchPopularMovies();
      setPopularMovies(data);
    };
    getMovies();
  }, []);

  useEffect(() => {
    const getTopMovies = async () => {
      const data = await fetchTopRatedMovies();
      setTopRatedMovies(data);
    };
    getTopMovies();
  }, []);

  useEffect(() => {
    const getUpCoMovies = async () => {
      const data = await fetchUpCoMovies();
      setUpcomingMovies(data);
    };
    getUpCoMovies();
  }, []);

  useEffect(() => {
    const getTopAMovies = async () => {
      const data = await fetchTopMovies();
      setTopMovies(data);
    };
    getTopAMovies();
  }, []);


  
  return (
    <>
    <NavigationBar />
    <div className="slider-area bg-black">
      <div className="md:container mx-auto p-0">
        <Slider {...settings}>
          {topMovies && topMovies.length > 0 ? (
            topMovies.map((movie) => (
              <div key={movie.id} className="single-slider">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="img-fluid"
                />
                <div className="slider-overlay">
                  <div className="slider-content">
                    <h1 className="title text-white">{movie.title}</h1>
                    <div className="sub-title text-gray-300">
                      {movie.year || "Year not available"}
                      {" || "}
                      {Array.isArray(movie.genres) && movie.genres.length > 0
                        ? movie.genres.join(", ")
                        : "Genres not available"}
                      {" || "}
                      {Array.isArray(movie.countries) && movie.countries.length > 0
                        ? movie.countries.join(", ")
                        : "Countries not available"}
                      {" || "}
                      {movie.rating || "Rating not available"}
                    </div>
                    <button 
                        className="play-button"
                        onClick={() => handlePlayWrapper(movie.trailer)}
                    >
                        <FaPlay className="mr-2" /> Play
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No movies to display</p>
          )}
        </Slider>

        {/* Modal untuk menampilkan video trailer */}
        {show && (
            <div className="modal-overlay" onClick={handleCloseWrapper}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={handleCloseWrapper}>Close</button>
                    <iframe
                        src={videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        )}

        <MovieCard title={"Popular"} movies={popularMovies} />
        <div className="see-more">
            <Link to="/all-movies?category=popular" className="see-more-button">
                See More
            </Link>
        </div>
        <MovieCard title={"Top Rated"} movies={topratedMovies} />
        <div className="see-more">
          <Link to="/all-movies?category=top_rated" className="see-more-button">
            See More
          </Link>
        </div>
        <MovieCard title={"Upcoming"} movies={upcomingMovies} />
        <div className="see-more">
          <Link to="/all-movies?category=upcoming" className="see-more-button">
            See More
          </Link>
        </div>
        <Footer/>
      </div>
    </div>
    </>
  );
};

export default HomePage;
