import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/redux/store';

export default function ThemeProvider() {
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  return null;
}
