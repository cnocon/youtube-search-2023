import React, { useMemo, useState, useCallback } from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import Pagination from 'react-bootstrap/Pagination';
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
import Video from './Video';
import VideoResult from './VideoResult';
// import fauxData from './fauxData';

function App() {
  const [loadingMainVid, setLoadingMainVid] = useState(false);
  const [data, setData] = useState(null);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [pageToken, setPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    resultsPerPage: 0,
    totalResults: 0
  });

  const loadVideoResults = useCallback(
    async function () {
      let options = {
        key: process.env.REACT_APP_GOOGLE_API_KEY,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: 3
      };
      if (pageToken?.length) {
        options = Object.assign({ pageToken: pageToken }, options);
      }
      const URL = "https://www.googleapis.com/youtube/v3/search?" + Object.keys(options).map((k) => k + '=' + encodeURIComponent(options[k])).join('&');

      setLoading(true);

      await fetch(URL)
      .then(res => res.json())
      .then(jsonRes => {
        setNextPageToken(jsonRes?.nextPageToken || null);
        setPrevPageToken(jsonRes?.prevPageToken || null);
        setPageInfo(jsonRes.pageInfo);
        setData(jsonRes);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
      })
    }, [query, pageToken]);

  return (
    <Stack style={{alignItems: 'stretch'}}>
      <Header />

      <Container>
        <Row className="App" style={{minHeight: 'calc(100vh - 150px - 2rem)'}}>
          <Col md={7} style={{justifyContent: 'center', display: 'flex', alignItems: 'center', margin: '2rem auto', flexWrap: 'wrap'}}>
            <Card style={{textAlign: 'center', width: '100%'}}>
              <Card.Header>Search For and Choose a Video</Card.Header>
              <Card.Body>
                {loadingMainVid && activeItem ? <Spinner variant="primary" style={{width: '75px', height: '75px', margin: 'auto', fontSize: '30px'}} /> : activeItem ? <Video id={activeItem} /> : <></>}
              </Card.Body>
             </Card>
          </Col>
          <Col md={7} style={{margin: '0 auto'}}>
            <Container>
              <Form onSubmit={(e) => {
                e.preventDefault();
                setCurrentPage(1);
                setPageToken(null);
                setPrevPageToken(null);
                setNextPageToken(null);
                loadVideoResults();
              }}>
                <InputGroup className="mb-3">
                  <Form.Control
                    name="query"
                    type="text"
                    placeholder="Search YouTube"
                    aria-describedby="search-btn"
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

          <Col sm={12}>
            <Stack>
              {(pageToken || nextPageToken) && <Pagination className="my-4" style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                {prevPageToken && <Pagination.Prev onClick={(e) => {
                  setPageToken(prevPageToken);
                  setCurrentPage((currentPage) => currentPage - 1);
                  loadVideoResults();
                }}>{prevPageToken} (Prev)</Pagination.Prev>}
                <Pagination.Ellipsis />
                <Pagination.Item>{pageToken} {currentPage}</Pagination.Item>
                <Pagination.Ellipsis />
                {nextPageToken && <Pagination.Next onClick={(e) => {
                  setPageToken(nextPageToken);
                  setCurrentPage((currentPage) => currentPage + 1);
                  loadVideoResults();
                }}>{nextPageToken} (Next)</Pagination.Next>}
              </Pagination>}
            </Stack>
          </Col>
          <Col xs={12} sm={12}>
            <Container>
              {pageInfo?.totalResults > 0 && (
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
                    <>
                      <p><b>{pageToken}</b> Found {pageInfo?.totalResults} results</p>
                      <Stack direction="horizontal" gap={4} style={{alignItems: 'stretch', justifyContent: 'center', flexWrap: 'wrap'}}>
                        {data?.items?.map((item, index) => {
                          return <VideoResult key={`video-result-${index}`} item={item} setActiveItem={setActiveItem} setLoadingMainVid={setLoadingMainVid} loading={loading} />
                      })}
                    </Stack>
                  </>
                  )}
              </Stack>
              )}
            </Container>
          </Col>
        </Row>
      </Container>

      <Footer />
    </Stack>
  );
}

// export default React.memo(App);
export default App;
