import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to get current timestamp
const now = () => new Date().toISOString();

// Create tracking store
export const useTrackingStore = create()(
  persist(
    (set, get) => ({
      // Store tracking data
      events: [],
      pageLoads: [],
      scrollDepths: [],
      buttonClicks: [],

      // Add page load event
      trackPageLoad: (page, loadTime) => set((state) => ({
        pageLoads: [...state.pageLoads, {
          timestamp: now(),
          page,
          loadTime
        }]
      })),

      // Add scroll depth event
      trackScrollDepth: (page, depth) => set((state) => ({
        scrollDepths: [...state.scrollDepths, {
          timestamp: now(),
          page,
          depth
        }]
      })),

      // Add button click event
      trackButtonClick: (buttonId, page) => set((state) => ({
        buttonClicks: [...state.buttonClicks, {
          timestamp: now(),
          buttonId,
          page
        }]
      })),

      // Export data as CSV
      exportToCSV: () => {
        const { pageLoads, scrollDepths, buttonClicks } = get();

        // Create CSV content for each data type
        const pageLoadsCSV = [
          ['Timestamp', 'Page', 'Load Time (ms)'],
          ...pageLoads.map(event => [event.timestamp, event.page, event.loadTime])
        ].map(row => row.join(',')).join('\n');

        const scrollDepthsCSV = [
          ['Timestamp', 'Page', 'Scroll Depth (%)'],
          ...scrollDepths.map(event => [event.timestamp, event.page, event.depth])
        ].map(row => row.join(',')).join('\n');

        const buttonClicksCSV = [
          ['Timestamp', 'Button ID', 'Page'],
          ...buttonClicks.map(event => [event.timestamp, event.buttonId, event.page])
        ].map(row => row.join(',')).join('\n');

        // Create Blob for each file
        const files = {
          'page-loads.csv': new Blob([pageLoadsCSV], { type: 'text/csv' }),
          'scroll-depths.csv': new Blob([scrollDepthsCSV], { type: 'text/csv' }),
          'button-clicks.csv': new Blob([buttonClicksCSV], { type: 'text/csv' })
        };

        // Download each file
        Object.entries(files).forEach(([filename, blob]) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      },

      // Clear all tracking data
      clearTrackingData: () => set({
        pageLoads: [],
        scrollDepths: [],
        buttonClicks: []
      })
    }),
    {
      name: 'user-tracking-storage'
    }
  )
);

// Track scroll depth
let lastScrollDepth = 0;
export const initScrollTracking = () => {
  window.addEventListener('scroll', () => {
    const currentPage = window.location.pathname;
    
    // Calculate scroll depth percentage
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY;
    const scrollDepth = Math.round((scrolled / docHeight) * 100);
    
    // Only track if depth changed by more than 10%
    if (Math.abs(scrollDepth - lastScrollDepth) >= 10) {
      useTrackingStore.getState().trackScrollDepth(currentPage, scrollDepth);
      lastScrollDepth = scrollDepth;
    }
  });
};

// Track page load time
export const trackPageLoad = () => {
  const currentPage = window.location.pathname;
  const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
  useTrackingStore.getState().trackPageLoad(currentPage, loadTime);
};

// Track button clicks
export const trackButtonClick = (buttonId) => {
  const currentPage = window.location.pathname;
  useTrackingStore.getState().trackButtonClick(buttonId, currentPage);
};