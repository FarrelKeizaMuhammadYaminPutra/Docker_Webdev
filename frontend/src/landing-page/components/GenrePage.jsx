import { Card, Dropdown, Form, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faStar } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";
import IMG7 from "../../assets/img-1.png";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const GenrePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query'); // Capture the search query from the URL

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const genres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Parody", "Romance", "Sci-Fi", "Sports", "Thriller"];
  const countries = ["Indonesia", "Korea", "Japan", "China", "USA"];
  const year = ["2024", "2023", "2022", "2021", "2020", "2019"];
  const status = ["Ongoing", "Completed", "Upcoming"];

  // Simulated movie data (you can replace this with actual data fetching)
  const movies = [
    { title: "My Hero Academia", year: 2019, genre: "Action", rating: 8.5, country: "Japan", status: "Ongoing" },
    { title: "Demon Slayer", year: 2019, genre: "Action", rating: 8.7, country: "Japan", status: "Ongoing" },
    { title: "Attack on Titan", year: 2013, genre: "Action", rating: 9.0, country: "Japan", status: "Completed" },
  ];

  // Function to filter movies based on selected filters and search query
  const filteredMovies = movies.filter(movie => {
    const matchesQuery = movie.title.toLowerCase().includes(query?.toLowerCase() || "");
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(movie.genre);
    const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(movie.country);
    const matchesYear = selectedYears.length === 0 || selectedYears.includes(movie.year.toString());
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(movie.status);

    return matchesQuery && matchesGenre && matchesCountry && matchesYear && matchesStatus;
  });

  // Helper function to handle filter changes
  const handleFilterChange = (setSelected, value) => {
    setSelected(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  return (
    <section className="trending p-40 mySearch">
      <div className="container-fluid">
        <Row>
          {/* Filter Section */}
          <Col md={3}>
            <div className="filter mb-32">
              <h4 className="h-30 bold color-white mb-32" style={{ marginBottom: '25px', fontFamily: 'Monaco, monospace', fontWeight: 'bold' }}>Filtered By:</h4>
              <ul className="filter-block unstyled mb-32" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '10px' }}>
                  {/* Genre Filter */}
                  <li style={{ marginBottom: '15px' }}>
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic" style={{ width: '150px', fontFamily:'Monaco, monospace' }}>Genre</Dropdown.Toggle>
                      <Dropdown.Menu style={{ width: '360px' }}>
                        <Row>
                          {genres.map((genre, index) => (
                            <Col xs={4} key={index}>
                              <Form.Check
                                type="checkbox"
                                id={`genre-${index}`}
                                label={genre}
                                style={{ color: 'black' }}
                                onChange={() => handleFilterChange(setSelectedGenres, genre)}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  {/* Country Filter */}
                  <li style={{ marginBottom: '15px' }}>
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic" style={{ width: '150px', fontFamily:'Monaco, monospace' }}>Country</Dropdown.Toggle>
                      <Dropdown.Menu style={{ width: '240px' }}>
                        <Row>
                          {countries.map((country, index) => (
                            <Col xs={6} key={index}>
                              <Form.Check
                                type="checkbox"
                                id={`country-${index}`}
                                label={country}
                                style={{ color: 'black' }}
                                onChange={() => handleFilterChange(setSelectedCountries, country)}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  {/* Year Filter */}
                  <li style={{ marginBottom: '15px' }}>
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic" style={{ width: '150px', fontFamily:'Monaco, monospace' }}>Year</Dropdown.Toggle>
                      <Dropdown.Menu style={{ width: '160px' }}>
                        <Row>
                          {year.map((year, index) => (
                            <Col xs={6} key={index}>
                              <Form.Check
                                type="checkbox"
                                id={`year-${index}`}
                                label={year}
                                style={{ color: 'black' }}
                                onChange={() => handleFilterChange(setSelectedYears, year)}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  {/* Status Filter */}
                  <li style={{ marginBottom: '15px' }}>
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic" style={{ width: '150px', fontFamily:'Monaco, monospace' }}>Status</Dropdown.Toggle>
                      <Dropdown.Menu style={{ width: '150px' }}>
                        <Row>
                          {status.map((status, index) => (
                            <Col xs={7} key={index}>
                              <Form.Check
                                type="checkbox"
                                id={`status-${index}`}
                                label={status}
                                style={{ color: 'black' }}
                                onChange={() => handleFilterChange(setSelectedStatus, status)}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </div>
              </ul>
              <a href='#' className='cus-btn primary mb-50' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', backgroundColor: '#28a745', borderRadius: '10px', color: 'white', textDecoration: 'none', width: '150px', fontFamily:'Monaco, monospace' }}>
                Filter
                <FontAwesomeIcon icon={faFilter} style={{ marginLeft: '8px' }} />
              </a>
            </div>
          </Col>

          {/* Movie Results Section */}
          <Col md={9} style={{ color: 'white' }}>
            <h5 style={{ marginTop: '50px', marginBottom: '30px', fontWeight: 'bold', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
              Search Results for: {query}
            </h5>
            
            <Row>
              {filteredMovies.length > 0 ? filteredMovies.map((movie, index) => (
                <Col md={6} key={index}>
                  <div className="movieCardSearch mb-30" style={{ display: 'flex', alignItems: 'center', width: '100%', border: '1.5px solid #1dbf73' }}>
                    <Image style={{ width: '60px' }} src={IMG7} alt={movie.title} className="br-12" />
                    <div className="content" style={{ marginLeft: '10px' }}>
                      <Link to="/detail" className="card-link h-30 color-white mb-8 hero">
                        <Card.Title className="text-left"><h4>{movie.title}</h4></Card.Title>
                      </Link>
                      <ul className="tag-unstyled mb-16" style={{ display: 'flex', gap: '5px' }}>
                        <li>{movie.year}</li>
                        <li>|</li>
                        <li>{movie.genre}</li>
                        <li>|</li>
                        <li className="justify-content-end" style={{ display: 'flex', alignItems: 'center' }}>
                          <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700' }} />
                          <span style={{ marginLeft: '4px' }}>{movie.rating}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              )) : <p>No results found</p>}
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default GenrePage;
