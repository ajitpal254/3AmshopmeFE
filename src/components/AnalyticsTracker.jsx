import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    // Replace with your Measurement ID or use an environment variable
    const TRACKING_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

    if (TRACKING_ID) {
      ReactGA.initialize(TRACKING_ID);
    }
  }, []);

  useEffect(() => {
    // Send pageview with a custom path
    if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [location]);

  return null;
};

export default AnalyticsTracker;
