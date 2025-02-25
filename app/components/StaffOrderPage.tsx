'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Order } from '../types';

export default function StaffOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 注文を定期的に更新
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STAFF_URL}/api/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('注文の取得に失敗しました:', error);
      }
    };

    // 初回読み込み
    fetchOrders();

    // 2秒ごとに更新
    const interval = setInterval(fetchOrders, 2000);

    // クリーンアップ
    return () => clearInterval(interval);
  }, []);

  // 1分経過した注文を自動で削除
  useEffect(() => {
    const now = new Date();
    setOrders(prevOrders =>
      prevOrders.filter(order => {
        const orderTime = new Date(order.timestamp);
        const diffInMinutes = (now.getTime() - orderTime.getTime()) / (1000 * 60);
        return diffInMinutes < 1;
      })
    );
  }, [lastUpdate]); // lastUpdateが変更されたときに実行

  // 注文を時刻でソート（新しい順）
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">注文一覧</h1>
        <div className="text-sm text-gray-500">
          最終更新: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
      
      {sortedOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          現在の注文はありません
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded shadow bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{order.seatNumber}席</h2>
                <span className="text-gray-500">
                  {new Date(order.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${item.menuItem.id}-${Math.random()}`} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      {item.menuItem.imagePath ? (
                        <Image
                          src={item.menuItem.imagePath}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 64px, 64px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {item.menuItem.name}
                          {item.withMilk !== undefined && 
                            ` (${item.withMilk ? 'ミルクあり' : 'ミルクなし'})`}
                        </span>
                        <span className="text-gray-600">×{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <span className="text-lg font-bold">
                  合計: ¥{order.items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 