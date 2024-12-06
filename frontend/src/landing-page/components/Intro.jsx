import { Card, Col, Container, Row, Dropdown, Button, Image } from "react-bootstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import trailer from "../../assets/bgcnth.jpeg";
import { Link } from "react-router-dom";
import { FaPlay, FaInfo } from "react-icons/fa";
import MovieCard from "./MovieCard";
import IMG1 from "../../assets/dune.jpg";
import IMG2 from "../../assets/everything.jpg";
import IMG3 from "../../assets/infinite.jpg";
import IMG4 from "../../assets/joker.jpg";
import IMG5 from "../../assets/lightyear.jpg";
import IMG6 from "../../assets/morbius.jpg";
import IMG7 from "../../assets/img-1.png";
import Slider from "react-slick";
import NavigationBar from "./NavigationBar";
import 'bootstrap/dist/css/bootstrap.min.css';

const Intro = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,  // Menyesuaikan jumlah film per baris
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const movies = [
    { image: IMG1, title: "My Hero Academia", genre: "Drama, Thriller, Sci-fi", views: 19, rating: 8.5, year: 2024 },
    { image: IMG2, title: "Everything Everywhere All at Once", genre: "Sci-fi, Adventure", views: 23, rating: 9.0, year: 2022 },
    { image: IMG3, title: "Infinite", genre: "Action, Sci-fi", views: 15, rating: 7.2, year: 2021 },
    { image: IMG4, title: "Joker", genre: "Drama, Thriller", views: 42, rating: 8.9, year: 2019 },
    { image: IMG5, title: "Lightyear", genre: "Animation, Adventure", views: 32, rating: 7.8, year: 2022 },
    { image: IMG6, title: "Morbius", genre: "Horror, Thriller", views: 28, rating: 5.4, year: 2022 },
  ];

  return (
    <>
    <NavigationBar/>
    <div className="intro">
      <Container className="text-white">
        <Row>
          <Col className="banner p-4">
            <div className="container-fluid">
              <div className="row">
                <div className="col-xxl-9 mb-xxl-0">
                  <div className="anime-card">
                    <div className="content m-2">
                      <h2 className="h-40 bold color-white mb-3" style={{paddingTop: '180px'}}>
                        Demon Slayer:<br />
                        Kimetsu no Yaiba
                      </h2>
                      <ul className="tag unstyled mb-2 d-flex">
                        <li className="me-2">18+</li>
                        <li className="me-2">HD</li>
                        <li className="me-2">2029</li>
                        <li className="me-2">Anime</li>
                        <li>1hr 45m</li>
                      </ul>
                      <p className="color-white mb-2">
                        <b className="color-medium-gray">Starting:</b> Natsuki Hanae, Akari Kito, Hiro Shimono
                      </p>
                      <div className="btn-block">
                        <Button href="#" variant="success" className="me-2">
                          <FaPlay id="play-icon"/> Play
                        </Button>
                        <Button href="#" variant="secondary">
                          <FaInfo id="info-icon"/> More Info
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* genre */}
        <div className="page-content">
          <section className="categories p-40">
            <div className="container-fluid">
              <div className="row">
                <div className="col-xxl-3 col-sm-6 mb-30">
                    <Link to="/search" className="categorie-item">
                      <Image src={IMG7} className="categorie-image br-12" />
                      <div className="content">
                        <h2 className="h-36 mb-1 color-white">Action</h2>
                        <span className="h-20 color-medium-gray">850+ Film</span>
                      </div>
                    </Link>
                </div>
                <div className="col-xxl-3 col-sm-6 mb-30">
                  <Link to="/search" className="categorie-item">
                    <Image src={IMG7} className="categorie-image br-12" />
                    <div className="content">
                      <h2 className="h-36 mb-1 color-white">Fantasy</h2>
                      <span className="h-20 color-medium-gray">850+ Film</span>
                    </div>
                  </Link>
                </div>
                <div className="col-xxl-3 col-sm-6 mb-30">
                  <Link to="/search" className="categorie-item">
                    <Image src={IMG7} className="categorie-image br-12" />
                    <div className="content">
                        <h2 className="h-36 mb-1 color-white">Sci-fi</h2>
                        <span className="h-20 color-medium-gray">850+ Film</span>
                    </div>
                  </Link>
                </div>
                <div className="col-xxl-3 col-sm-6 mb-30">
                  <Link to="/search" className="categorie-item">
                    <Image src={IMG7} className="categorie-image br-12" />
                    <div className="content">
                      <h2 className="h-36 mb-1 color-white">Romance</h2>
                      <span className="h-20 color-medium-gray">850+ Film</span>
                    </div>
                  </Link>
                </div>
                <div className="col-xxl-3 col-sm-6 mb-30">
                  <Link to="/search" className="categorie-item">
                    <Image src={IMG7} className="categorie-image br-12" />
                    <div className="content">
                      <h2 className="h-36 mb-1 color-white">Comedy</h2>
                      <span className="h-20 color-medium-gray">850+ Film</span>
                    </div>
                  </Link>
                </div>
                <div className="col-xxl-3 col-sm-6 mb-30">
                  <Link to="/search" className="categorie-item">
                    <Image src={IMG7} className="categorie-image br-12" />
                    <div className="content">
                      <h2 className="h-36 mb-1 color-white">Thriller</h2>
                      <span className="h-20 color-medium-gray">850+ Film</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Row className="justify-content-center g-4 m-2">
          <h2>TRENDING</h2>
          <Col md={15} className="slide-container">
            <Slider {...settings}>
              {movies.map((movie, index) => (
                <div key={index}>
                  <MovieCard
                    image={movie.image}
                    title={movie.title}
                    genre={movie.genre}
                    views={movie.views}
                    rating={movie.rating}
                    year={movie.year}
                  />
                </div>
              ))}
            </Slider>
          </Col>
        </Row>       
      </Container>
    </div>
    </>
  );
};

export default Intro;
