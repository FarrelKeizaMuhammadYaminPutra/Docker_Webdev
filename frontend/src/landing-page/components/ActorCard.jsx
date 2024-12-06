import { Card, Col } from "react-bootstrap";
import "../../style/ActorCard.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const ActorCard = ({ image, name }) => {
    return (
        <Col md="auto" className="mb-2 px-2"> {/* Mengurangi padding horizontal */}
            <Card className="text-white text-center actor-card" style={{ border: 'none', background: 'transparent', width: '150px' }}>
                <Card.Img variant="top" src={image} className="actor-img" style={{ height: '200px', objectFit: 'cover', borderRadius: '10px' }} />
                <Card.Body>
                    <Card.Title style={{ color: 'white', fontSize: '14px', textAlign: 'center' }}>{name}</Card.Title>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ActorCard;
