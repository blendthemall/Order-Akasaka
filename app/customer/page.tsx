'use client';

import CustomerOrderPage from '../components/CustomerOrderPage';

export default function CustomerPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">お客様用注文画面</h1>
        <CustomerOrderPage />
      </div>
    </main>
  );
} 