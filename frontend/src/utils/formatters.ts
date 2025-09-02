// Date formatting utilities
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Duration formatting utilities
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDurationFromSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return formatDuration(minutes);
};

// Weight formatting utilities
export const formatWeight = (weight: number, unit: 'kg' | 'lbs' = 'kg'): string => {
  return `${weight.toFixed(1)} ${unit}`;
};

export const convertWeight = (weight: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number => {
  if (from === to) return weight;
  
  if (from === 'kg' && to === 'lbs') {
    return weight * 2.20462;
  } else if (from === 'lbs' && to === 'kg') {
    return weight / 2.20462;
  }
  
  return weight;
};

// Distance formatting utilities
export const formatDistance = (distance: number, unit: 'm' | 'km' | 'ft' | 'mi' = 'm'): string => {
  return `${distance.toFixed(2)} ${unit}`;
};

export const convertDistance = (
  distance: number, 
  from: 'm' | 'km' | 'ft' | 'mi', 
  to: 'm' | 'km' | 'ft' | 'mi'
): number => {
  if (from === to) return distance;
  
  // Convert to meters first
  let meters = distance;
  switch (from) {
    case 'km':
      meters = distance * 1000;
      break;
    case 'ft':
      meters = distance * 0.3048;
      break;
    case 'mi':
      meters = distance * 1609.344;
      break;
  }
  
  // Convert from meters to target unit
  switch (to) {
    case 'km':
      return meters / 1000;
    case 'ft':
      return meters / 0.3048;
    case 'mi':
      return meters / 1609.344;
    default:
      return meters;
  }
};

// Number formatting utilities
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toFixed(decimals);
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};