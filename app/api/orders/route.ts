import { NextResponse } from 'next/server';
import { Order } from '../../types';

// メモリ内でオーダーを保持（共有データストア）
const orders: Order[] = [];

// CORS Preflight リクエストへの対応
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  // 1分以上経過した注文を削除
  const now = new Date();
  const filteredOrders = orders.filter(order => {
    const orderTime = new Date(order.timestamp);
    const diffInMinutes = (now.getTime() - orderTime.getTime()) / (1000 * 60);
    return diffInMinutes < 1;
  });

  return new NextResponse(JSON.stringify(filteredOrders), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newOrder: Order = {
      ...body,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };

    orders.push(newOrder);
    
    return new NextResponse(JSON.stringify(newOrder), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('注文処理エラー:', error);
    return new NextResponse(JSON.stringify({ error: '注文の処理に失敗しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 