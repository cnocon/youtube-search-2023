import React, { useMemo, useState, useCallback } from 'react'
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
import Header from './Header';
import Footer from './Footer';
import fauxData from './fauxData';

const Video = ({id}) => {
  return <iframe className="p-0" key={id} title={id} width="100%" height="300px" src={`https://www.youtube.com/embed/${id}`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
}
function App() {
  const [loadingMainVid, setLoadingMainVid] = useState(false);
  const [data, setData] = useState(fauxData);
  const [query, setQuery] = useState("people tripping but not getting hurt");
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  // React Hooks are simple JavaScript functions that we can use to isolate the reusable part from a functional component. Hooks can be stateful and can manage side-effects
  let options = useMemo(() => ({
    key: process.env.REACT_APP_GOOGLE_API_KEY,
    q: query,
    part: 'snippet'
  }), [query]);

  let URL = "https://www.googleapis.com/youtube/v3/search?" + Object.keys(options).map((k) => k + '=' + encodeURIComponent(options[k])).join('&');

  // useMemo(() => {
  //   if (loadingMainVid) {
  //     setLoadingMainVid(false);
  //   }
  // }, [loadingMainVid])

  let loadVideoResults = useCallback(
    async function () {
      console.log("loadVideoResults called");
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
    }, [URL]);

  return (
    <div className="wrapper">
      <Header />
      <Container>
        <Row className="App">
          <Col xs={12} sm={12} style={{justifyContent: 'center', display: 'flex', minHeight: '300px', alignItems: 'center', maxWidth: '650px', margin: '2rem auto'}}>
             {loadingMainVid && activeItem ? <Spinner /> : <Video id={activeItem} />}
          </Col>
          <Col xs={12} sm={12} style={{maxWidth: '650px', margin: '0 auto'}}>
            <Container>
              <Form onSubmit={(e) => {
                e.preventDefault();
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
          </Col>
          <Col xs={12} sm={12}>
            <Container>
              <Stack gap={4} style={{display: 'flex', alignItems: 'center', minHeight: '30vh'}}>
                {loading ? (
                  <Spinner
                    variant="primary"
                    animation="border"
                    role="status"
                    style={{width: '100px', height: '100px', margin: 'auto'}}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <Stack direction="horizontal" gap={4} style={{alignItems: 'stretch', justifyContent: 'center', flexWrap: 'wrap'}}>
                    {data?.items?.map((item, index) => {
                      return <Card style={{flexBasis: '30%'}}>
                        <Card.Body style={{display: 'flex', height: '100%', justifyContent: 'center'}}>
                          <Image
                            src={item.snippet.thumbnails.medium.url}
                            style={{maxHeight: '150px', width: 'auto'}}
                            thumbnail
                            onClick={(e) => {
                              e.preventDefault();
                              setLoadingMainVid(true);
                              setActiveItem(item.id.videoId);
                              setTimeout(() => {
                                setLoadingMainVid(false);
                              }, 500)
                            }}
                          />
                      </Card.Body>
                      <Card.Footer>{item.snippet.title}</Card.Footer>
                    </Card>
                  })}
              </Stack>
            )}
            </Stack>
            </Container>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

// export default React.memo(App);
export default App;
