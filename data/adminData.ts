import { AdminOrder, StockSKU, PosHit } from '@/types';

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: '#HV-8842',
    time: '14:31:02',
    customerName: 'Kabir Mehta',
    location: 'Bandra West, Mumbai',
    manifest: 'Vintage Bootcut (Dust Blue - 32) + Drive Jacket',
    itemSpecs: '2 ITEMS // 14.5 OZ JAPANESE DENIM',
    channel: 'Online Store',
    total: 8848.10,
    status: 'Awaiting Pickup'
  },
  {
    id: '#HV-8841',
    time: '14:28:44',
    customerName: 'Arya Sen',
    location: 'Indiranagar, Bangalore',
    manifest: 'Washed Olive Boxy Cut Tee (L)',
    itemSpecs: '1 ITEM // 280 GSM COMBED COTTON',
    channel: 'Online Store',
    total: 1199.00,
    status: 'Processing'
  },
  {
    id: '#HV-8840',
    time: '14:24:19',
    customerName: 'Rohan Deshmukh',
    location: 'Walk-in POS Flagship',
    manifest: 'Baggy Fit Denim (Rustic Wash - 30)',
    itemSpecs: '1 ITEM // RAW HEAVYWEIGHT 15 OZ',
    channel: 'Chapel Rd POS',
    total: 3199.00,
    status: 'Flagship Collected'
  },
  {
    id: '#HV-8839',
    time: '14:15:30',
    customerName: 'Ananya Rao',
    location: 'Civil Lines, Delhi',
    manifest: 'Barrel Fit Selvedge (Ecru - 28)',
    itemSpecs: '1 ITEM // SHUTTLE LOOM WEAVE',
    channel: 'Online Store',
    total: 3450.00,
    status: 'Dispatched'
  },
  {
    id: '#HV-8838',
    time: '14:02:11',
    customerName: 'Zubin Master',
    location: 'Koregaon Park, Pune',
    manifest: 'Vintage Bootcut (Pitch Black - 34)',
    itemSpecs: '1 ITEM // SULFUR OVERDYE',
    channel: 'Online Store',
    total: 2999.00,
    status: 'Dispatched'
  }
];

export const INITIAL_STOCK_SKUS: StockSKU[] = [
  {
    id: 'sku-1',
    name: 'VINTAGE BOOTCUT (DUST BLUE)',
    sku: 'DEN-VBC-DBL-08',
    tag: 'HIGH RUNOUT',
    sizes: [
      { size: '28', count: 0, status: 'OUT' },
      { size: '30', count: 0, status: 'OUT' },
      { size: '32', count: 2, status: 'CRIT' },
      { size: '34', count: 4, status: 'LOW' },
      { size: '36', count: 12, status: 'OK' },
    ]
  },
  {
    id: 'sku-2',
    name: 'BAGGY FIT (SUN-FADED BLUE)',
    sku: 'DEN-BGY-SFB-08',
    tag: '100% SOLD',
    sizes: [
      { size: '28', count: 0, status: 'OUT' },
      { size: '30', count: 0, status: 'OUT' },
      { size: '32', count: 0, status: 'OUT' },
      { size: '34', count: 0, status: 'OUT' },
      { size: '36', count: 0, status: 'OUT' },
    ]
  },
  {
    id: 'sku-3',
    name: 'DRIVE JACKET (BURGUNDY)',
    sku: 'JKT-DRV-BRG-08',
    tag: '6 UNITS LEFT',
    sizes: [
      { size: 'S', count: 0, status: 'OUT' },
      { size: 'M', count: 6, status: 'LOW' },
      { size: 'L', count: 0, status: 'OUT' },
      { size: 'XL', count: 0, status: 'OUT' },
    ]
  }
];

export const INITIAL_POS_HITS: PosHit[] = [
  {
    id: 'pos-1',
    title: '2x Vintage Bootcut (Black 32)',
    terminal: 'CARD SWIPE TERMINAL 01 // 14:26 IST',
    amount: 5998
  },
  {
    id: 'pos-2',
    title: 'Raw Indigo Tote + Beanie',
    terminal: 'UPI SCAN TERMINAL 02 // 14:18 IST',
    amount: 1850
  }
];
