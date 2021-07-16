import React, { useState, useEffect } from 'react';
import axios from "axios"


const Video = () => {
  // const [imageIds, setImageIds] = useState([]);

  // useEffect(() => {
  //   axios.get("http://localhost:5000/")
  //     .then(res => {
  //       console.log(res)
  //       setImageIds(res.data)
  //     })
  //     .catch(err => console.log(err.response.data))

  // }, [])

  // const loadImages = async () => {
  //     try {
  //         const res = await axios.get("http://localhost:5000/");
  //         setImageIds(res.data);
  //     } catch (err) {
  //         console.error(err);
  //     }
  // };
  // useEffect(() => {
  //     loadImages();
  // }, []);
  return (
    <div className="container">
      <h1 className="title">Watch Video</h1>
      <div>
        <video width="320" height="240" controls src="/uploads/dd53c4eb940a8a6f9066b901f1d616eb">
        </video>
        {/* {
          imageIds.map((imageId, index) => (
            <video
              controls
              key={index}
              width="300"
              height="300"
              src={"uploads/" + imageId}
            >
            </video>
          ))} */}
      </div>
    </div>
  );
}

export default Video;