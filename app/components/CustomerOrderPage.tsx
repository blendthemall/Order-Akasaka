'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem, Order, SeatNumber } from '../types';
import { FaCoffee } from 'react-icons/fa';
import { IoWater } from 'react-icons/io5';
import { BiDrink } from 'react-icons/bi';

const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'ホットコーヒー',
    price: 0,
    category: 'drink',
    description: '深煎りの香り高いコーヒー',
    icon: '☕',
    color: '#4B3621',
    imagePath: '/images/hot-coffee.webp'
  },
  {
    id: 2,
    name: 'アイスコーヒー',
    price: 0,
    category: 'drink',
    description: '氷でキリッと冷やしたコーヒー',
    icon: '☕',
    color: '#6F4E37',
    imagePath: '/images/iced-coffee.webp'
  },
  {
    id: 3,
    name: '水',
    price: 0,
    category: 'drink',
    description: '冷たい水',
    icon: '💧',
    color: '#87CEEB',
    imagePath: '/images/water.webp'
  },
  {
    id: 4,
    name: 'お茶',
    price: 0,
    category: 'drink',
    description: '香り高い日本茶',
    icon: '🍵',
    color: '#90EE90',
    imagePath: '/images/tea.webp'
  },
  {
    id: 5,
    name: 'オレンジジュース',
    price: 0,
    category: 'drink',
    description: '搾りたての果汁100%',
    icon: '🍊',
    color: '#FFA500',
    imagePath: '/images/orange-juice.webp'
  },
  {
    id: 6,
    name: 'グレープフルーツジュース',
    price: 0,
    category: 'drink',
    description: 'さっぱりとした酸味',
    icon: '🍊',
    color: '#FFB6C1',
    imagePath: '/images/grapefruit-juice.webp'
  },
];

export default function CustomerOrderPage() {
  const [selectedSeat, setSelectedSeat] = useState<SeatNumber>('A');
  const [cart, setCart] = useState<{menuItem: MenuItem; quantity: number; withMilk?: boolean}[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showMilkOption, setShowMilkOption] = useState(false);

  const addToCart = (menuItem: MenuItem, withMilk?: boolean) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.menuItem.id === menuItem.id && item.withMilk === withMilk
      );
      if (existingItem) {
        return prevCart.map(item =>
          item.menuItem.id === menuItem.id && item.withMilk === withMilk
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { menuItem, quantity: 1, withMilk }];
    });
  };

  const handleItemClick = (menuItem: MenuItem) => {
    if (menuItem.name.includes('コーヒー')) {
      setSelectedItem(menuItem);
      setShowMilkOption(true);
    } else {
      addToCart(menuItem);
    }
  };

  const handleMilkOptionSelect = (withMilk: boolean) => {
    if (selectedItem) {
      addToCart(selectedItem, withMilk);
      setSelectedItem(null);
      setShowMilkOption(false);
    }
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;

    const order: Omit<Order, 'id'> = {
      seatNumber: selectedSeat,
      items: cart,
      timestamp: new Date(),
      status: 'pending'
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STAFF_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(order),
      });

      if (response.ok) {
        setCart([]);
        alert('ご注文ありがとうございます。');
      } else {
        const errorData = await response.text();
        console.error('注文エラー:', errorData);
        alert('注文の送信に失敗しました。');
      }
    } catch (error) {
      console.error('通信エラー:', error);
      alert('注文の送信に失敗しました。サーバーに接続できません。');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <label htmlFor="seatSelect" className="block text-lg mb-2">座席番号:</label>
        <select
          id="seatSelect"
          value={selectedSeat}
          onChange={(e) => setSelectedSeat(e.target.value as SeatNumber)}
          className="border p-2 rounded"
          aria-label="座席を選択"
        >
          {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((seat) => (
            <option key={seat} value={seat}>
              {seat}席
            </option>
          ))}
        </select>
      </div>

      {showMilkOption && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">{selectedItem.name}</h3>
            <p className="mb-4">ミルクを追加しますか？</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleMilkOptionSelect(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                ミルクあり
              </button>
              <button
                onClick={() => handleMilkOptionSelect(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                ミルクなし
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        {SAMPLE_MENU_ITEMS.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 mb-4">
              {item.imagePath ? (
                <Image
                  src={item.imagePath}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded">
                  <span className="text-5xl" style={{ color: item.color }}>
                    {item.icon}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-bold">{item.name}</h3>
            </div>
            <p className="text-gray-600">{item.description}</p>
            <button
              onClick={() => handleItemClick(item)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              カートに追加
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">注文内容</h2>
          {cart.map((item, index) => (
            <div key={`${item.menuItem.id}-${item.withMilk}-${index}`} className="flex justify-between mb-2">
              <span>
                {item.menuItem.name}
                {item.withMilk !== undefined && ` (${item.withMilk ? 'ミルクあり' : 'ミルクなし'})`}
                {' x '}{item.quantity}
              </span>
            </div>
          ))}
          <div className="mt-4">
            <button
              onClick={submitOrder}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              注文を確定する
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 