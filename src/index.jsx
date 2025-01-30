import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/App.scss'; // Import global SASS

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
