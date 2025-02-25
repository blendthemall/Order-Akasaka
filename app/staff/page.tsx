'use client';

import StaffOrderPage from '../components/StaffOrderPage';

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">スタッフ用注文管理画面</h1>
        <StaffOrderPage />
      </div>
    </main>
  );
} 