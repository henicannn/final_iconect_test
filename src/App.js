import React from 'react';
import FilesUploader from './components/FilesUploader/FilesUploader';
import DropBox from './components/DropBox/DropBox';
import './style.scss';

export default function App() {
  return (
    <div>
      <FilesUploader />
      <DropBox />
    </div>
  );
}
