'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme="synthwave"
      enableSystem={false}
      themes={['synthwave', 'corporate']}
    >
      {children}
    </ThemeProvider>
  );
}

export default Providers;
