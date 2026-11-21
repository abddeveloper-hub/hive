import { NextResponse } from 'next/server';
import { INITIAL_ADMIN_ORDERS } from '@/data/adminData';
import { AdminOrder } from '@/types';

// In-memory backend store
let orders: AdminOrder[] = [...INITIAL_ADMIN_ORDERS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');
  const status = searchParams.get('status');
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...orders];

  if (channel && channel !== 'all') {
    if (channel === 'online') {
      filtered = filtered.filter((o) => o.channel === 'Online Store');
    } else if (channel === 'chapel-rd') {
      filtered = filtered.filter((o) => o.channel === 'Chapel Rd POS');
    }
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((o) => o.status === status);
  }

  if (query) {
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.manifest.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    totalOrders: orders.length,
    orders: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder: AdminOrder = {
      id: body.id || `#HV-${Math.floor(8800 + Math.random() * 200)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      customerName: body.customerName || 'Walk-in Guest',
      location: body.location || 'Bandra West, Mumbai',
      manifest: body.manifest || 'Store Garment',
      itemSpecs: body.itemSpecs || '1 ITEM // JAPANESE DENIM',
      channel: body.channel || 'Online Store',
      total: Number(body.total) || 1199,
      status: body.status || 'Processing',
    };

    orders = [newOrder, ...orders];

    return NextResponse.json({
      success: true,
      message: 'Order created in fulfillment stream',
      order: newOrder,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid order payload' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    const idx = orders.findIndex((o) => o.id === orderId);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    orders[idx].status = status;

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} updated to ${status}`,
      order: orders[idx],
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 400 });
  }
}
