import { NextResponse } from 'next/server';
import { DENIM_PRODUCTS, TOPWEAR_PRODUCTS, SPOTLIGHT_PRODUCT } from '@/data/products';
import { Product } from '@/types';

let catalog: Product[] = [SPOTLIGHT_PRODUCT, ...DENIM_PRODUCTS, ...TOPWEAR_PRODUCTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let list = [...catalog];
  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  return NextResponse.json({
    success: true,
    count: list.length,
    products: list,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct: Product = {
      id: body.id || `drop-${Date.now()}`,
      name: body.name,
      category: body.category || 'denim',
      fit: body.fit,
      colorway: body.colorway,
      price: Number(body.price),
      originalPrice: Number(body.originalPrice) || Number(body.price) * 1.25,
      discountBadge: body.discountBadge || 'NEW DROP',
      badgeLabel: body.badgeLabel || 'LIMITED',
      sizes: body.sizes || ['28', '30', '32', '34', '36'],
      image:
        body.image ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDirQroA1268KwtEQHni702QqK0BewgBfOGk6KcD_nwkoMVYjqQ8LY4SyN50aivlx7zmRQfLpgFgijky8ScdVE1Gi9Gmjfy3K1RGiZa06PWmHWbQNl7RVg9Pu4Ka6iR4ubUPsFRhVzwrYafFCp6wgGK4Dv-2Va0cHggMnDQt1DBT_R9M504n0AD6E5Zm6QuWXxjJ7smCHOC3zjqq28au7PMPQbpok29Xff4I1YfIXc',
      alt: body.name,
      fabricSpecs: body.fabricSpecs || {
        weight: '14.0 oz Raw Shuttle Selvedge',
        composition: '100% Ring Spun Cotton',
      },
      description: body.description || 'New archival piece introduced in DROP 09 cycle.',
    };

    catalog = [newProduct, ...catalog];

    return NextResponse.json({
      success: true,
      message: `Drop ${newProduct.name} published to catalog`,
      product: newProduct,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid product payload' }, { status: 400 });
  }
}
