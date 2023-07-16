import React from 'react'
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

const Footer = ({ setLoadingMainVid, setActiveItem, item, loading }) => {
  return loading ? (
      <Spinner
        variant="primary"
        animation="border"
        role="status"
        style={{width: '100px', height: '100px', margin: 'auto'}}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    ) : (
      <Card style={{flexBasis: '30%'}}>
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
  );
}

export default Footer;
