import { useEffect, useState, useCallback } from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';

import fauxData from './fauxData';

const Video = ({id}) => {
  return <iframe className="p-0" key={id} title={id} width="100%" height="300px" src={`https://www.youtube.com/embed/${id}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
}
function App() {
  const [data, setData] = useState(fauxData);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  let options = {
    key: process.env.REACT_APP_GOOGLE_API_KEY,
    q: query,
    part: 'snippet'
  }
  let URL = "https://www.googleapis.com/youtube/v3/search?" + Object.keys(options).map((k) => k + '=' + encodeURIComponent(options[k])).join('&');

  let loadVideoResults = useCallback(
    async function () {
      setLoading(true);

      await fetch(URL)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err)
      })
    }, [URL])

    useEffect(() => {
      if (data === null) {
        loadVideoResults();
      }
    }, [data, loadVideoResults])

    return (
      <Container>
        <Row className="App">
          <Col md={12}>
            <Navbar expand="md">
              <Container>
                <Navbar.Brand href="/">Search YouTube</Navbar.Brand>
              </Container>
            </Navbar>
          </Col>
          <Col md={6}>
            <Container>
            <Form onSubmit={(e) => {
              e.preventDefault();
              setQuery(e.target.value);
              loadVideoResults();
            }}>
              <InputGroup className="mb-3">
                <Form.Control
                  name="query"
                  type="text"
                  placeholder="Search YouTube"
                  aria-describedby="search-btn"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                />

                <Button
                  variant="primary"
                  type="submit"
                  md={4}
                  lg={2}
                  id="search-btn"
                >
                  Search
                </Button>
              </InputGroup>
            </Form>
          </Container>
          <Container>
            <Video id={activeItem} />
          </Container>
        </Col>
        <Col md={6}>
          <Stack gap={4}>
            {loading ? (
              <Row>
                <Col>
                  <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span></Spinner>
                </Col>
              </Row>
            ) : data?.items?.map((item) => {
              return <Card key={item.snippet.title}>
                <Card.Header>
                  <h4>{item.snippet.title} &bull; {item.snippet.channelTitle}</h4>
                </Card.Header>
                <Card.Body>
                  <Image
                    src={item.snippet.thumbnails.medium.url}
                    thumbnail
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveItem(item.id.videoId);
                    }}
                  />
              </Card.Body>
              </Card>})}
            </Stack>
          </Col>
        </Row>
      </Container>
      );
    }

    export default App;
