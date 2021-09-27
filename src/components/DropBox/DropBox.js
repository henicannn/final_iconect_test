import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './DropBox.scss';

export default function DropBox() {
  const [selectFiles, setSelectFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [validFiles, setValidFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const [progressBarWidth, setProgressBarWidth] = useState(1);

  const fileInputRef = useRef();
  const uploadModalRef = useRef();
  const uploadRef = useRef();
  const progressRef = useRef();

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      setSelectFiles((prevArray) => [...prevArray, files[i]]);
    }
  };

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const fileSize = (size) => {
    if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileType = (fileName) => {
    return (
      fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) ||
      fileName
    );
  };

  const removeFile = (name) => {
    const index = validFiles.findIndex((e) => e.name === name);
    const index2 = selectFiles.findIndex((e) => e.name === name);
    const index3 = unsupportedFiles.findIndex((e) => e.name === name);
    validFiles.splice(index, 1);
    selectFiles.splice(index2, 1);
    setValidFiles([...validFiles]);
    setSelectFiles([...selectFiles]);
    if (index3 !== -1) {
      unsupportedFiles.splice(index3, 1);
      setUnsupportedFiles([...unsupportedFiles]);
    }
  };

  useEffect(() => {
    let filteredArray = selectFiles.reduce((file, current) => {
      const x = file.find((item) => item.name === current.name);
      if (!x) {
        return file.concat([current]);
      } else {
        return file;
      }
    }, []);
    setValidFiles([...filteredArray]);
  }, [selectFiles]);

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  };

  // This function below will only allow certain types of files like png, jpeg or pdf. We can simply add file format in validTypes and pass the conditions in handleFiles for displaying error coded. For now I am allowing all types of files to upload.

  // const validateFile = (file) => {
  //   const validTypes = [];
  //   if (validTypes.indexOf(file.type) === -1) {
  //     return false;
  //   }

  //   return true;
  // };

  // Also created server.js and we can use axios to simply post the files in public/data folder when we are running on local machine.

  const uploadFiles = () => {
    if (selectFiles.length <= 1) {
      uploadModalRef.current.style.display = 'block';
      uploadRef.current.innerHTML = 'File(s) Uploading...';
    }
    var i = 0;
    if (i == 0) {
      i = 1;
      var width = progressBarWidth;
      var id = setInterval(frame, 100);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          progressRef.current.style.width = width + '%';
          progressRef.current.innerHTML = width + '%';
        }

        if (width === 100) {
          setProgressBarWidth(width);
        }
        if (width == 100) {
          uploadRef.current.innerHTML = 'File(s) Uploaded';
          validFiles.length = 0;
          setValidFiles([...validFiles]);
          setUnsupportedFiles([...validFiles]);
          setTimeout(function () {
            uploadModalRef.current.style.display = 'none';
          }, 1000);
        }
      }
    }
  };

  useEffect(() => {
    if (progressBarWidth === 100) {
      console.log(selectFiles);
    }
  }, [progressBarWidth === 100]);

  return (
    <div className="DropBox">
      {unsupportedFiles.length === 0 && validFiles.length ? (
        <button className="DropBox-btn" onClick={() => uploadFiles()}>
          Upload
        </button>
      ) : (
        ''
      )}
      {unsupportedFiles.length ? (
        <p>Please remove all unsupported files.</p>
      ) : (
        ''
      )}
      <div
        className="DropBox__container"
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
        onClick={fileInputClicked}
      >
        <div className="DropBox__container-message">
          <p>Drag & Drop files here or click to upload</p>
        </div>
        <input
          ref={fileInputRef}
          className="DropBox__container-input"
          type="file"
          multiple
          onChange={filesSelected}
        />
      </div>
      <div>
        <div className="DropBox__file">
          {validFiles.map((data, i) => (
            <div className="DropBox__file-status" key={i}>
              <div
                onClick={
                  !data.invalid
                    ? () => openImageModal(data)
                    : () => removeFile(data.name)
                }
              >
                <div className="DropBox__file-type">{fileType(data.name)}</div>
                <span
                  className={`DropBox__file-name ${
                    data.invalid ? 'file-error' : ''
                  }`}
                >
                  {data.name}
                </span>
                <span className="DropBox__file-size">
                  ({fileSize(data.size)})
                </span>
                {data.invalid && (
                  <span className="DropBox__file-error-message">
                    ({errorMessage})
                  </span>
                )}
              </div>
              <div
                className="DropBox__file-remove"
                onClick={() => removeFile(data.name)}
              >
                X
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="DropBox__upload-modal" ref={uploadModalRef}>
        <div className="DropBox__upload-overlay"></div>
        <div className="DropBox__upload-progress-container">
          <span ref={uploadRef}></span>
          <div className="DropBox__progress">
            <div
              className="DropBox__upload-progress-bar"
              ref={progressRef}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
