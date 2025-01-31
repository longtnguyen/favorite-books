import React from 'react';
import './LoadingIndicator.scss';

function LoadingIndicator() {
  return (
    <div className="loading-indicator">
      <img
        src="/_LoadingIcon.png"
        alt="Loading..."
        className="loading-icon"
        aria-hidden="true"
      />
      <span className="loading-text">Loading...</span>
    </div>
  );
}

export default LoadingIndicator;
