import { NextResponse } from 'next/server';
import { INITIAL_STOCK_SKUS } from '@/data/adminData';
import { StockSKU } from '@/types';

let stockSkus: StockSKU[] = JSON.parse(JSON.stringify(INITIAL_STOCK_SKUS));

export async function GET() {
  const totalUnits = stockSkus.reduce((total, sku) => {
    return total + sku.sizes.reduce((sum, s) => sum + s.count, 0);
  }, 0);

  const criticalSkus = stockSkus.filter((sku) =>
    sku.sizes.some((s) => s.status === 'OUT' || s.status === 'CRIT')
  ).length;

  return NextResponse.json({
    success: true,
    totalUnits,
    criticalSkus,
    skus: stockSkus,
  });
}

export async function POST(request: Request) {
  try {
    const { skuId, size, addCount } = await request.json();
    const sku = stockSkus.find((s) => s.id === skuId || s.sku === skuId);

    if (!sku) {
      return NextResponse.json({ success: false, error: 'SKU not found' }, { status: 404 });
    }

    const sizeObj = sku.sizes.find((s) => s.size === size);
    if (!sizeObj) {
      return NextResponse.json({ success: false, error: 'Size not found in SKU' }, { status: 404 });
    }

    sizeObj.count += Number(addCount) || 10;
    if (sizeObj.count > 10) sizeObj.status = 'OK';
    else if (sizeObj.count > 3) sizeObj.status = 'LOW';
    else if (sizeObj.count > 0) sizeObj.status = 'CRIT';
    else sizeObj.status = 'OUT';

    return NextResponse.json({
      success: true,
      message: `Restocked ${sku.name} Size ${size} (+${addCount} units)`,
      sku,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid restock payload' }, { status: 400 });
  }
}
