import React, { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Form, Image } from "react-bootstrap";
import toastr from "toastr";

function CropImage({ onCropImage, selectedFile, imgCrop, setImgCrop }) {
  const [img, setImg] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (
        e.target.files[0]?.name &&
        !e.target.files[0]?.name?.match(
          /\.(jpg|jpeg|png|gif|svg|webp|bmp|xpm|BMP)$/
        )
      ) {
        toastr.warning("Please upload an image file");
        return;
      }
      const img = {
        preview: e.target.files[0]
          ? URL.createObjectURL(e.target.files[0])
          : "",
        data: e.target.files[0],
      };
      let imgData = img?.preview
        ? { src: img.preview, showImage: true, cropImage: true }
        : { src: "", showImage: false, cropImage: false };
      setImgCrop((prev) => ({ ...prev, ...imgData }));
    }
  };

  const handleCrop = async () => {
    let crop = imgCrop.crop;
    if (!img) {
      console.log("img not loaded");
      return;
    }
    if (crop.height && crop.width) {
      const croppedImage = await getCroppedImg(img, crop, "test");
      console.log("CroppedImage", croppedImage);
      if (croppedImage){

        // const dataForDoc = await uploadFileOnS3(file);
        // // formData.append("s3Url", s3Url);
    
        // const response = await CommmonService.uploadDocument({
        //   ...dataForDoc,
        //   alias: description,
        //   source: source || "Incident",
        // });
        setImgCrop({
          src: croppedImage,
          cropImage: false,
          showImage: false,
        });
      }
    }
  };

  // //  call parent function
  // useEffect(() => {
  //   if (imgCrop.src && onCropImage) {
  //     onCropImage(imgCrop.src);
  //   }
  // }, [imgCrop.src]);
  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    let originWidth = crop.width * scaleX;
    let originHeight = crop.height * scaleY;
    // maximum width/height
    let maxWidth = 1200,
      maxHeight = 1200 / (16 / 9);
    let targetWidth = originWidth,
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
        <Form.Group controlId="formFile" className="uploadFileBtn">
          <Form.Label></Form.Label>
          <Form.Control
            className="uploadFile"
            onChange={(e) => handleFileChange(e)}
            type="file"
            accept="image/*"
          />
        </Form.Group>
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
