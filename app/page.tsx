'use client';

import { useEffect, useState } from 'react';
import CustomerOrderPage from './components/CustomerOrderPage';
import StaffOrderPage from './components/StaffOrderPage';

export default function Home() {
  const [isStaffView, setIsStaffView] = useState(false);

  useEffect(() => {
    // URLのポート番号に基づいて表示を切り替え
    const port = window.location.port;
    setIsStaffView(port === '4001');
  }, []);

  return isStaffView ? <StaffOrderPage /> : <CustomerOrderPage />;
} 