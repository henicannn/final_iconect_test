import React, { useState } from 'react';
import './FilesUploader.scss';

export default function FilesUploader() {
  return (
    <div className="FilesUploader">
      <p className="FilesUploader__title">React Drag and Drop Image Upload</p>
      <div className="FilesUploader__content"></div>
    </div>
  );
}
