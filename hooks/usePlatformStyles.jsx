import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

const usePlatformStyles = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, []);

  return { isMobile };
};

export default usePlatformStyles;
