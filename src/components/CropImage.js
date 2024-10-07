import React, { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// import { FiCamera } from "react-icons/fi";
import { Button, Form, Image } from "react-bootstrap";
import UserDefaultPic from "../Assets/Images/user-default.png";

// import { PARSE_IMG_URL } from "../../../_helpers/commonHelper";

// let initialCropImageState = {
//   src: "",
//   showImage: false,
//   cropImage: false,
// };

function CropImage({
  onCropImage,
  selectedFile,
  path,
  imgCrop,
  setImgCrop,
  handleFileSelect,
}) {
  //   const [imgCrop, setImgCrop] = useState(initialCropImageState);
  const [img, setImg] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);

  //  select file
  //   const handleFileSelect = (event) => {
  //     console.log("called111ll");
  //     let file = event.target.files[0];
  //     if (file) {
  //       let src = URL.createObjectURL(file);

  //       setImgCrop({
  //         src,
  //         showImage: true,
  //         cropImage: true,
  //       });
  //     } else {
  //       setImgCrop({
  //         src: "",
  //         showImage: false,
  //         cropImage: false,
  //       });
  //     }
  //   };

  //  crop file
  //   const onCropComplete = (crop) => {
  //     handleCrop(crop);
  //   };
  const handleCrop = async () => {
    // let { crop, img } = this.state;
    let crop = imgCrop.crop;
    if (!img) {
      console.log("img not loaded");

      return;
    }
    if (crop.height && crop.width) {
      const croppedImage = await getCroppedImg(img, crop, "test");
      console.log("CroppedImage", croppedImage);
      if (croppedImage)
        setImgCrop({
          src: croppedImage,
          cropImage: false,
          showImage: false,
        });
    }
  };

  //  call parent function
  useEffect(() => {
    if (imgCrop.src && onCropImage) {
      onCropImage(imgCrop.src);
    }
  }, [imgCrop.src]);
  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    var originWidth = crop.width * scaleX;
    var originHeight = crop.height * scaleY;
    // maximum width/height
    var maxWidth = 1200,
      maxHeight = 1200 / (16 / 9);
    var targetWidth = originWidth,
      targetHeight = originHeight;
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    // set canvas size
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );
    // As Base64 string
    const base64Image = canvas.toDataURL("image/jpeg");
    return base64Image;
    // As a blob
    /*  return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        1.0
      )
    }); */
  };
  const handleImageLoaded = (image) => {
    if (!image) {
      console.error("Image failed to load");
    } else {
      console.log("Image loaded:", image);
      setImg(image.target);
    }
  };
  return (
    <div className="text-center">
      <div className="">
        {imgCrop?.showImage ? (
          <div>
            <ReactCrop
              style={{ maxWidth: "50%" }}
              src={imgCrop?.src}
              crop={imgCrop?.crop}
              circularCrop={false}
              //   onImageLoaded={handleImageLoaded}
              onChange={(newCrop) => {
                setImgCrop((pre) => ({ ...pre, crop: newCrop }));
              }}
            >
              <img
                src={imgCrop?.src}
                onLoad={handleImageLoaded}
                alt="User Profile"
              />
            </ReactCrop>
          </div>
        ) : (
          <div className="profileShortInfoSec">
            {imgCrop?.src ? (
              <div className="profilePicPreview ">
                <Image src={imgCrop?.src} alt="User Profile" roundedCircle />
              </div>
            ) : (
              <div className="">
                {selectedFile && (
                  <Image src={selectedFile} alt="User Profile" roundedCircle />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {/* <Form.Group controlId="formFile" className="uploadFileBtn">
          <Form.Label></Form.Label>
          <Form.Control
            className="uploadFile"
            onChange={(e) => handleFileSelect(e)}
            type="file"
            accept="image/*"
          />
        </Form.Group> */}
      </div>
      {/* </div> */}
      {imgCrop?.showImage && imgCrop?.cropImage ? (
        <button onClick={handleCrop} className="btn-secondary-outline">
          Crop Image
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default CropImage;
