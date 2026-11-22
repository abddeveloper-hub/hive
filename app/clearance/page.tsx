import { DENIM_PRODUCTS, TOPWEAR_PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const clearanceProducts = [...DENIM_PRODUCTS, ...TOPWEAR_PRODUCTS]
  .filter((product) => !product.isSoldOut && product.originalPrice > product.price)
  .map((product) => ({
    ...product,
    discountBadge:
      product.discountBadge ||
      `${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF`,
  }));

export default function ClearancePage() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 pb-10">
      <section className="border-b border-surface-container pb-5 pt-6">
        <p className="font-label-mono-sm text-label-mono-sm uppercase tracking-[0.2em] text-secondary">
          HIVE // LAST CHANCE
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display-hero-mobile text-display-hero-mobile uppercase font-bold leading-none text-pure-white sm:text-display-hero">
              Clearance
            </h1>
            <p className="mt-2 max-w-xl font-body-md text-body-md text-on-surface-variant">
              Final prices on selected denim and streetwear. Every marked price is shown alongside its original price.
            </p>
          </div>
          <p className="font-label-mono-sm text-label-mono-sm uppercase text-outline">
            {clearanceProducts.length} styles // up to 20% off
          </p>
        </div>
      </section>

      {clearanceProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" id="clearance-grid">
          {clearanceProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center font-label-mono-sm text-label-mono-sm uppercase text-outline">
          No clearance styles are available right now.
        </p>
      )}
    </div>
  );
}
