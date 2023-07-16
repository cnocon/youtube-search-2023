import React from 'react'

const Video = ({ id }) => {
  return <iframe
    className="p-0"
    key={id}
    title={id}
    width="100%"
    height="300px"
    src={`https://www.youtube.com/embed/${id}?autoplay=1`}
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    autoplay
  ></iframe>
}

export default Video;