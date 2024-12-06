import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import { useState } from 'react';

const SearchPage = ({ onSearch, onFilter }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState({
        genre: '',
        year: '',
        rating: '',
        award: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleFilterChange = (key, value) => {
        setFilter({
            ...filter,
            [key]: value
        });
        onFilter({
            ...filter,
            [key]: value
        });
    };

    return (
        <Container className="my-4">
            <Row>
                <Col md={6} id='search'>
                    <Form onSubmit={handleSearch}>
                        <Form.Group controlId="formSearch">
                            <Form.Control 
                                type="text" 
                                placeholder="Search by title, actor, or genre..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="warning" type="submit" className="mt-2">
                            Search
                        </Button>
                    </Form>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col>
                            <Dropdown onSelect={(value) => handleFilterChange('genre', value)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-genre">
                                    Genre
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Action">Action</Dropdown.Item>
                                    <Dropdown.Item eventKey="Drama">Drama</Dropdown.Item>
                                    <Dropdown.Item eventKey="Comedy">Comedy</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Dropdown onSelect={(value) => handleFilterChange('year', value)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-year">
                                    Year
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="2024">2024</Dropdown.Item>
                                    <Dropdown.Item eventKey="2023">2023</Dropdown.Item>
                                    <Dropdown.Item eventKey="2022">2022</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Dropdown onSelect={(value) => handleFilterChange('rating', value)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-rating">
                                    Rating
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="5">5 Stars</Dropdown.Item>
                                    <Dropdown.Item eventKey="4">4 Stars</Dropdown.Item>
                                    <Dropdown.Item eventKey="3">3 Stars</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Dropdown onSelect={(value) => handleFilterChange('award', value)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-award">
                                    Award
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Oscar">Oscar</Dropdown.Item>
                                    <Dropdown.Item eventKey="Emmy">Emmy</Dropdown.Item>
                                    <Dropdown.Item eventKey="Golden Globe">Golden Globe</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default SearchPage;