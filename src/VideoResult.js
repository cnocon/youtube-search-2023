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
      <Card style={{flexBasis: '30%', display: 'flex', justifyContent: 'center'}}>
        <Card.Header style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '84px', width: '100%', textAlign: 'center', fontWeight: '600'}}>
          {item.snippet.title}
        </Card.Header>
        <Card.Body style={{height: '100%', textAlign: 'center'}}>
          <Image
            src={item.snippet.thumbnails.medium.url}
            style={{maxHeight: '150px', margin: 'auto'}}
            thumbnail
            onClick={(e) => {
              e.preventDefault();
              setLoadingMainVid(true);
              setActiveItem(item.id.videoId);
              setTimeout(() => {
                setLoadingMainVid(false);
              }, 750)
            }}
          />
          {/* <hr />
          <p style={{textAlign: 'left', marginTop: 'auto'}}>{item.snippet.description}</p> */}
      </Card.Body>

    </Card>
  );
}

export default Footer;
