// Performance Monitoring
export const initPerformanceMonitoring = () => {
  // Core Web Vitals
  const vitals = {};

  // First Contentful Paint
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    vitals.fcp = entries[entries.length - 1];
  });
  fcpObserver.observe({ entryTypes: ['paint'] });

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    vitals.lcp = entries[entries.length - 1];
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    vitals.fid = entries[entries.length - 1];
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    vitals.cls = entries[entries.length - 1];
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // Report metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = {
        ...vitals,
        navigationTiming: performance.getEntriesByType('navigation')[0],
        resources: performance.getEntriesByType('resource'),
      };
      
      console.log('Performance Metrics:', metrics);
      // Hier könnte man die Metriken an einen Analytics-Service senden
    }, 3000);
  });
};

// Memory Usage Monitoring
export const monitorMemoryUsage = () => {
  if (performance.memory) {
    setInterval(() => {
      const memory = {
        total: performance.memory.totalJSHeapSize,
        used: performance.memory.usedJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
      
      if (memory.used / memory.limit > 0.9) {
        console.warn('High memory usage detected:', memory);
        // Hier könnte man eine Warnung an einen Monitoring-Service senden
      }
    }, 10000);
  }
};

// Resource Loading Performance
export const monitorResourceLoading = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
      if (entry.duration > 1000) {
        console.warn('Slow resource loading:', {
          resource: entry.name,
          duration: entry.duration
        });
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
};