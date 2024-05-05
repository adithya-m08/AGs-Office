import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [fileid, setFileId] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [dor, setDor] = useState('');
  const [pdfList, setPdfList] = useState([]);

  const handleVerify = async () => {
    const formData = new FormData();
    formData.append('fileid', fileid);
    formData.append('name', name);
    formData.append('dob', dob);
    formData.append('dor', dor);

    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setPdfList(data.pdf_list);
      } else {
        console.error('Verification failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDownload = async (filename) => {
    const res = await fetch(`http://localhost:5000/pdf_folder/${filename}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to download PDF');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">PPO Download</h1>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="fileid" className="form-label">File ID</label>
          <input type="number" className="form-control" id="fileid" value={fileid} onChange={(e) => setFileId(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="dob" className="form-label">DOB (DD/MM/YYYY)</label>
          <input type="text" className="form-control" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label htmlFor="dor" className="form-label">DOR (DD/MM/YYYY)</label>
          <input type="text" className="form-control" id="dor" value={dor} onChange={(e) => setDor(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleVerify}>Verify</button>
      <hr className="my-4" />
      <h3>Available PPO List</h3>
      <ul className="list-group">
        {pdfList.map((filename, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {filename}
            <button className="btn btn-success" onClick={() => handleDownload(filename)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
