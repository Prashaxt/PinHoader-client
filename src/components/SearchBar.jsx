import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchBar.css';
import SearchIcon from '../assets/search-favorite.svg';
import NotFound from '../assets/NotFoundMonster.png';


function isValidPinterestBoard(input) {
  let url = input.replace(/^https?:\/\//, '');
  url = url.replace(/^([a-z0-9-]+\.)*pinterest\.[a-z.]{2,6}\//, '');
  const pattern = /^[\w-]+\/[\w-]+\/?$/;
  return pattern.test(url);
}

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);

  const [boardInfo, setBoardInfo] = useState(null)
  const [pins, setPins] = useState([])

  const [isLoading, setIsLoading] = React.useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setValidationError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async (boardUrl) => {

    // Validate input before making the request
    if (!boardUrl.trim()) {
      setValidationError('Input cannot be empty.');
      return;
    }

    if (!isValidPinterestBoard(boardUrl)) {
      setValidationError('Please enter a valid Pinterest board URL.');
      return;
    }

    setValidationError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/downloadBoard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalStatus('error');
      } else {
        const boardData = data.apiResult?.data;
        setBoardInfo(boardData?.board)
        setPins(boardData?.pins || [])
        setModalStatus('success');
        console.log('Received API data:', data.apiResult)
      }
    } catch (error) {
      setModalStatus('error');
    } finally {
      setIsLoading(false);
    }

    setIsModalOpen(true);
  };

  const handleZipDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch('http://localhost:3001/api/downloadZip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pins: pins }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // board name to be a valid filename
      const sanitizeFilename = (name) => name.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();

      // Use boardInfo.name or fallback to default name
      const filename = boardInfo?.name ? `${sanitizeFilename(boardInfo.name)}.zip` : 'pinterest_pins.zip';

      // Trigger file download in browser
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      // Close modal
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };




  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault(); 
          handleSearch(inputValue);
        }}
        className="search-bar">
        <input
          id='url'
          type="text"
          placeholder="Pinterest Board Link Here"
          className="no-select"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
        type='submit'
          className="search-button no-select"
          disabled={isLoading}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLoading ? (
              <div className="spinner" />
            ) : (
              <>
                <img src={SearchIcon} alt="Search Icon" className="searchIcon" />
                <p>Search</p>
              </>
            )}
          </div>
        </button>
      </form>
      {validationError && (
        <div className='response-texts' style={{ color: 'red' }}>
          {validationError}
        </div>
      )}


      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className='close-cross'>X</button>
            <div className="board-result">
              {modalStatus === 'error' && (
                <div className='modal-error'>
                  <img src={NotFound} alt="Not Found" className='not-found-img' />
                  <div>
                    <h2>Not Found :(</h2>
                    <p className='error-notes'> • Please check the link.</p>
                    <p className='error-notes'> • Please make sure the board is public.</p>
                    <button onClick={closeModal} className='try-again'>Go Back</button>
                  </div>
                </ div>
              )}

              {modalStatus === 'success' && (
                <div className='modal-success'>
                  <div className='modal-success-content'>
                    <div className='board-details'>
                      <div className='board-info'>
                        <img src={boardInfo.image_thumbnail_url} className='board-thumbnail' alt="" />
                        <div>
                          <h3>{boardInfo.name}</h3>
                          <h4>Total Pins: {boardInfo.pin_count} </h4>
                        </div>
                      </div>
                      <button className='download-button' onClick={handleZipDownload} disabled={isDownloading} >
                        <div>
                          {isDownloading ? (
                            <div className="spinner" />
                          ) : (
                            <>
                              <p>Download</p>
                            </>
                          )}
                        </div>
                      </button>
                      {isDownloading && (
                        <div className='response-texts' style={{ color: 'green' }}>
                          <p>Your Board is downloading, please wait for few seconds.</p>
                        </div>
                      )}
                    </div>

                    <div className="pin-images">
                      {pins.slice(0, 8).map(pin => (
                        <div key={pin.id} className="pin">
                          <img
                            src={pin.images["236x"]?.url}
                          />
                        </div>
                      ))}
                    </div>

                  </div>
                  <div className='modal-bottom-texts'>
                    <p>You can download maximum of 300 pins per board.</p>
                    {/* <p>To download unlimited photos and videos, Upgrade Your Plan.</p> */}
                  </div>

                </ div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
