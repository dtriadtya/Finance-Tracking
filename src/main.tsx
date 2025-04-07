import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

// Register the plugin globally
Chart.register(ChartDataLabels);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);