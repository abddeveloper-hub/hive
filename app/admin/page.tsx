'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { INITIAL_ADMIN_ORDERS, INITIAL_STOCK_SKUS, INITIAL_POS_HITS } from '@/data/adminData';
import { AdminOrder, StockSKU, PosHit } from '@/types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'catalog' | 'inventory' | 'flagship' | 'vips' | 'analytics' | 'settings'>('overview');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'online' | 'chapel-rd'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);
  const [stockSkus, setStockSkus] = useState<StockSKU[]>(INITIAL_STOCK_SKUS);
  const [posHits, setPosHits] = useState<PosHit[]>(INITIAL_POS_HITS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isNewDropModalOpen, setIsNewDropModalOpen] = useState(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<AdminOrder | null>(null);

  // New Drop Form State
  const [newDropForm, setNewDropForm] = useState({
    name: 'Flare Cut Raw Denim',
    category: 'denim',
    fit: 'bootcut',
    price: 1399,
    stockCount: 15,
  });

  // POS Form State
  const [posForm, setPosForm] = useState({
    item: 'Vintage Bootcut (Dust Blue - 32)',
    price: 1199,
    method: 'upi',
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchChannel =
        selectedChannel === 'all' ||
        (selectedChannel === 'online' && o.channel === 'Online Store') ||
        (selectedChannel === 'chapel-rd' && o.channel === 'Chapel Rd POS');

      if (!matchChannel) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.manifest.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q)
      );
    });
  }, [orders, selectedChannel, searchQuery]);

  // Order status progression
  const cycleOrderStatus = (orderId: string) => {
    const statuses: AdminOrder['status'][] = [
      'Processing',
      'Awaiting Pickup',
      'Dispatched',
      'Delivered',
      'Flagship Collected',
    ];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const nextIdx = (statuses.indexOf(o.status) + 1) % statuses.length;
          const nextStatus = statuses[nextIdx];
          triggerToast(`Order ${o.id} marked as ${nextStatus}`);
          return { ...o, status: nextStatus };
        }
        return o;
      })
    );
  };

  // Restock action
  const handleRestockSKU = (skuId: string, size: string, count: number) => {
    setStockSkus((prev) =>
      prev.map((sku) => {
        if (sku.id === skuId) {
          const updatedSizes = sku.sizes.map((s) => {
            if (s.size === size) {
              const newCount = s.count + count;
              const newStatus: 'OUT' | 'CRIT' | 'LOW' | 'OK' =
                newCount > 10 ? 'OK' : newCount > 3 ? 'LOW' : newCount > 0 ? 'CRIT' : 'OUT';
              return {
                ...s,
                count: newCount,
                status: newStatus,
              };
            }
            return s;
          });
          return { ...sku, sizes: updatedSizes };
        }
        return sku;
      })
    );
    triggerToast(`Restocked ${size} (+${count} units)`);
  };

  // Export CSV Manifest
  const handleExportManifest = () => {
    const headers = ['Order ID', 'Customer', 'Location', 'Manifest', 'Channel', 'Total', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      `"${o.location}"`,
      `"${o.manifest}"`,
      `"${o.channel}"`,
      o.total,
      o.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HIVE_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('✓ Exported CSV order manifest');
  };

  // Submit New Drop
  const handleCreateNewDrop = (e: React.FormEvent) => {
    e.preventDefault();
    const newSku: StockSKU = {
      id: `sku-${Date.now()}`,
      name: newDropForm.name.toUpperCase(),
      sku: `DEN-${newDropForm.name.slice(0, 3).toUpperCase()}-09`,
      tag: 'FRESH DROP',
      sizes: [
        { size: '28', count: newDropForm.stockCount, status: 'OK' },
        { size: '30', count: newDropForm.stockCount, status: 'OK' },
        { size: '32', count: newDropForm.stockCount, status: 'OK' },
        { size: '34', count: newDropForm.stockCount, status: 'OK' },
        { size: '36', count: newDropForm.stockCount, status: 'OK' },
      ],
    };
    setStockSkus([newSku, ...stockSkus]);
    setIsNewDropModalOpen(false);
    triggerToast(`✓ New Drop "${newDropForm.name}" deployed to vault`);
  };

  // Process POS in-store order
  const handleProcessPos = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: AdminOrder = {
      id: `#HV-${Math.floor(8850 + Math.random() * 100)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      customerName: 'Flagship Walk-in Guest',
      location: 'Chapel Rd Counter, Bandra',
      manifest: posForm.item,
      itemSpecs: '1 ITEM // IN-STORE POS SALE',
      channel: 'Chapel Rd POS',
      total: posForm.price,
      status: 'Flagship Collected',
    };
    setOrders([newOrder, ...orders]);
    setPosHits([
      {
        id: `pos-${Date.now()}`,
        title: posForm.item,
        terminal: `${posForm.method.toUpperCase()} TERMINAL 01 // ${new Date().toLocaleTimeString('en-IN', { hour12: false })}`,
        amount: posForm.price,
      },
      ...posHits,
    ]);
    setIsPosModalOpen(false);
    triggerToast(`✓ In-Store Sale Recorded: ₹${posForm.price.toLocaleString('en-IN')}`);
  };

  return (
    <div className="bg-pitch-black font-body-md text-on-surface antialiased min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-rust-leather text-pure-white px-4 py-2.5 font-label-mono-sm text-xs uppercase shadow-2xl animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-dark z-50 flex flex-col justify-between border-r border-line-subtle">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header */}
          <div className="h-16 px-space-md flex items-center justify-between border-b border-line-subtle">
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-md text-headline-md tracking-tighter uppercase font-bold text-primary">
                HIVE
              </span>
              <span className="px-space-xs py-0.5 bg-surface-container border border-line-subtle font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant">
                HQ
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface-subtle border border-line-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface">OPS v2.4</span>
            </div>
          </div>

          {/* Node indicator & Link back to Storefront */}
          <div className="px-space-md py-space-sm border-b border-line-subtle bg-surface-subtle flex items-center justify-between">
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline">TERMINAL ACTIVE</span>
            <Link
              href="/"
              className="font-label-mono-sm text-label-mono-sm text-primary hover:underline uppercase flex items-center gap-1"
            >
              <span>Storefront</span>
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-space-sm py-space-md flex flex-col gap-1">
            <div className="px-space-sm pt-space-xs pb-1 font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-widest">
              Main Operations
            </div>

            <button
              className={`flex items-center gap-space-sm px-space-sm py-2 uppercase transition-colors text-left ${
                activeTab === 'overview'
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-mono-lg'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span>Overview</span>
            </button>

            <button
              className={`flex items-center justify-between px-space-sm py-2 font-label-mono-lg text-label-mono-lg uppercase transition-colors ${
                activeTab === 'orders'
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span>Orders &amp; Fulfillment</span>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm px-1.5 py-0.5 bg-rust-leather text-pure-white">
                {orders.length}
              </span>
            </button>

            <button
              className={`flex items-center gap-space-sm px-space-sm py-2 font-label-mono-lg text-label-mono-lg uppercase transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('catalog')}
            >
              <span className="material-symbols-outlined text-[18px]">styler</span>
              <span>Catalog &amp; Drops</span>
            </button>

            <button
              className={`flex items-center gap-space-sm px-space-sm py-2 font-label-mono-lg text-label-mono-lg uppercase transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('inventory')}
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Inventory &amp; Sizes</span>
            </button>

            <div className="px-space-sm pt-space-md pb-1 font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-widest">
              Retail Nodes &amp; CRM
            </div>

            <button
              className={`flex items-center justify-between px-space-sm py-2 font-label-mono-lg text-label-mono-lg uppercase transition-colors ${
                activeTab === 'flagship'
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('flagship')}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span>Chapel Rd Flagship</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-slate-denim"></span>
            </button>

            <button
              className={`flex items-center gap-space-sm px-space-sm py-2 font-label-mono-lg text-label-mono-lg uppercase transition-colors ${
                activeTab === 'vips'
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('vips')}
            >
              <span className="material-symbols-outlined text-[18px]">group</span>
              <span>Customers &amp; VIPs</span>
            </button>

            <div className="px-space-sm pt-space-md pb-1 font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-widest">
              Intelligence
            </div>

            <button
              className={`flex items-center gap-space-sm px-space-sm py-2 font-label-mono-lg text-label-mono-lg uppercase transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
              <span>Analytics &amp; Financials</span>
            </button>

            <button
              className={`flex items-center gap-space-sm px-space-sm py-2 font-label-mono-lg text-label-mono-lg uppercase transition-colors ${
                activeTab === 'settings'
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sync Footer */}
        <div className="p-space-md border-t border-line-subtle bg-surface-subtle flex flex-col gap-space-sm">
          <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
            <span className="text-outline">NETWORK SYNC</span>
            <span className="text-primary">0.04 MS</span>
          </div>
          <div className="w-full bg-surface-container h-1">
            <div className="bg-primary h-1 w-full"></div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase">NODE STATUS</span>
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface">ONLINE / SECURED</span>
          </div>
        </div>
      </aside>

      {/* TOP HEADER CONSOLE */}
      <div className="pl-72 min-h-screen bg-pitch-black">
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-dark/95 backdrop-blur-md z-40 border-b border-line-subtle flex items-center justify-between px-space-lg">
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm uppercase text-outline">
              <span className="text-on-surface-variant">HIVE ARCHIVE</span>
              <span className="text-line-subtle">/</span>
              <span className="text-primary font-bold">CONSOLE</span>
            </div>

            {/* Location Selector */}
            <div className="hidden xl:flex items-center gap-space-sm px-space-sm py-1 bg-surface-subtle border border-line-subtle">
              <span className="material-symbols-outlined text-[16px] text-outline">store</span>
              <select
                className="bg-transparent font-label-mono-sm text-label-mono-sm uppercase text-on-surface outline-none cursor-pointer pr-space-xs"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value as any)}
              >
                <option className="bg-surface-dark text-on-surface" value="all">
                  Consolidated Feed
                </option>
                <option className="bg-surface-dark text-on-surface" value="online">
                  Online Flagship [Global]
                </option>
                <option className="bg-surface-dark text-on-surface" value="chapel-rd">
                  Bandra Chapel Rd [Physical]
                </option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            {/* Search Input */}
            <div className="relative flex items-center w-80">
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline">search</span>
              <input
                className="w-full bg-surface-subtle border border-line-subtle pl-9 pr-14 py-1.5 font-label-mono-sm text-label-mono-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                placeholder="Search SKU, Order ID, VIP..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd className="absolute right-2 font-label-mono-sm text-[10px] text-outline border border-line-subtle px-1 bg-surface-container">
                ⌘K
              </kbd>
            </div>

            <div className="h-6 w-px bg-line-subtle"></div>

            <div className="flex items-center gap-space-xs">
              <button
                aria-label="Sync Database"
                className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                onClick={() => triggerToast('✓ Database sync complete (0.04 ms)')}
              >
                <span className="material-symbols-outlined text-[20px]">sync</span>
              </button>
              <button
                aria-label="Notifications"
                className="p-2 text-on-surface-variant hover:text-primary transition-colors relative flex items-center justify-center cursor-pointer"
                onClick={() => triggerToast('Notification: Bhiwandi Raw Mill batch in transit')}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rust-leather"></span>
              </button>
            </div>

            <div className="h-6 w-px bg-line-subtle"></div>

            {/* Archivist Profile */}
            <div className="flex items-center gap-space-sm pl-space-xs">
              <div className="text-right hidden sm:block">
                <div className="font-label-mono-sm text-label-mono-sm uppercase text-primary font-semibold">
                  R. VAZ
                </div>
                <div className="font-label-mono-sm text-[10px] text-outline uppercase">LEAD ARCHIVIST</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN OPERATIONS VIEW */}
        <main className="relative pt-16 w-full min-h-screen bg-pitch-black">
          <div className="flex flex-col w-full">
            <div className="w-full bg-surface-dark px-margin-desktop py-space-lg flex flex-col gap-space-lg">
              {/* Executive Header & Quick Action Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <span className="px-space-xs py-0.5 bg-rust-leather text-pure-white font-badge-caps text-badge-caps uppercase tracking-widest">
                      DROP 09 ACTIVE
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-outline flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                      LIVE — BOMBAY 15:45 IST
                    </span>
                    <span className="text-outline-variant font-label-mono-sm text-label-mono-sm">::</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">
                      SYS RUNNING CLUSTER-B04
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-sm">
                    <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight uppercase">
                      HQ OPERATIONS // OVERVIEW
                    </h1>
                    <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase">
                      [CONSOLIDATED ARCHIVE]
                    </span>
                  </div>
                </div>

                {/* Action Cluster Buttons */}
                <div className="flex flex-wrap items-center gap-space-xs">
                  <button
                    className="bg-primary text-pitch-black hover:bg-surface-bright hover:text-primary transition-colors font-headline-sm text-headline-sm uppercase px-4 py-2 flex items-center gap-1.5 font-semibold cursor-pointer"
                    onClick={() => setIsNewDropModalOpen(true)}
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>+ New Drop / SKU</span>
                  </button>

                  <button
                    className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors font-label-mono-lg text-label-mono-lg uppercase px-3 py-2 flex items-center gap-1.5 cursor-pointer"
                    onClick={() => setIsRestockModalOpen(true)}
                  >
                    <span className="material-symbols-outlined text-[16px] text-error">notification_important</span>
                    <span>Restock Alert (28)</span>
                  </button>

                  <button
                    className="bg-surface-subtle hover:bg-surface-container-high text-on-surface-variant transition-colors font-label-mono-lg text-label-mono-lg uppercase px-3 py-2 flex items-center gap-1.5 cursor-pointer"
                    onClick={handleExportManifest}
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Export Manifest</span>
                  </button>

                  <button
                    className="bg-surface-container hover:bg-surface-container-high text-primary transition-colors font-label-mono-lg text-label-mono-lg uppercase px-3 py-2 flex items-center gap-1.5 cursor-pointer"
                    onClick={() => setIsPosModalOpen(true)}
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-denim">point_of_sale</span>
                    <span>Live POS</span>
                  </button>
                </div>
              </div>

              {/* High-Level Performance Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
                {/* Metric 1 */}
                <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between relative group hover:bg-surface-subtle transition-colors">
                  <div className="flex items-center justify-between pb-space-sm">
                    <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline">
                      01 // GROSS REVENUE TODAY
                    </span>
                    <span className="px-1.5 py-0.5 bg-surface-container font-label-mono-sm text-[10px] text-primary uppercase">
                      +18.4% DROP CYCLE
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-sm my-space-xs">
                    <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                      ₹4,82,450
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-outline-variant">INR NET</span>
                  </div>
                  <div className="w-full my-space-xs">
                    <svg className="w-full h-8 text-primary overflow-visible" fill="none" viewBox="0 0 200 40">
                      <path
                        d="M0,32 L25,28 L50,35 L75,18 L100,24 L125,12 L150,16 L175,6 L200,2"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        vectorEffect="non-scaling-stroke"
                      ></path>
                      <path
                        d="M0,32 L25,28 L50,35 L75,18 L100,24 L125,12 L150,16 L175,6 L200,2 L200,40 L0,40 Z"
                        fill="currentColor"
                        fillOpacity="0.06"
                      ></path>
                    </svg>
                  </div>
                  <div className="pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                    <span>ONLINE: <strong className="text-primary font-medium">₹3.64L</strong></span>
                    <span className="text-outline">/</span>
                    <span>CHAPEL RD: <strong className="text-primary font-medium">₹1.18L</strong></span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between relative group hover:bg-surface-subtle transition-colors">
                  <div className="flex items-center justify-between pb-space-sm">
                    <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline">
                      02 // ACTIVE DENIM INVENTORY
                    </span>
                    <span className="px-1.5 py-0.5 bg-surface-container font-label-mono-sm text-[10px] text-on-surface uppercase">
                      106 ACTIVE SKUS
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-sm my-space-xs">
                    <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                      1,420
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">
                      UNITS VAULT
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 my-space-xs flex">
                    <div className="bg-primary h-full" style={{ width: '68%' }}></div>
                    <div className="bg-rust-leather h-full" style={{ width: '20%' }}></div>
                    <div className="bg-error-container h-full" style={{ width: '12%' }}></div>
                  </div>
                  <div className="pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                    <span className="text-error flex items-center gap-1">
                      <span className="w-1 h-1 bg-error rounded-full"></span>28 CRITICAL RESTOCK
                    </span>
                    <span className="text-secondary">84 LOW-STOCK</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between relative group hover:bg-surface-subtle transition-colors">
                  <div className="flex items-center justify-between pb-space-sm">
                    <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline">
                      03 // QUEUED FULFILLMENT
                    </span>
                    <span className="px-1.5 py-0.5 bg-rust-leather text-pure-white font-badge-caps text-badge-caps uppercase">
                      PICKUP 17:00
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-sm my-space-xs">
                    <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                      {orders.length}
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">
                      SHIPMENTS
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 my-space-xs">
                    <div className="bg-surface-container px-2 py-1 flex flex-col">
                      <span className="font-label-mono-sm text-[10px] text-outline">EXP PRIORITY</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">42</span>
                    </div>
                    <div className="bg-surface-container px-2 py-1 flex flex-col">
                      <span className="font-label-mono-sm text-[10px] text-outline">PACKED READY</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">112</span>
                    </div>
                    <div className="bg-surface-container px-2 py-1 flex flex-col">
                      <span className="font-label-mono-sm text-[10px] text-outline">IN AUDIT</span>
                      <span className="font-headline-sm text-headline-sm text-outline font-bold">30</span>
                    </div>
                  </div>
                  <div className="pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-outline">
                    <span>DELHIVERY AIR / BLUEDART</span>
                    <span className="text-primary font-medium">92% PACK RATE</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between relative group hover:bg-surface-subtle transition-colors">
                  <div className="flex items-center justify-between pb-space-sm">
                    <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline">
                      04 // RETURN &amp; EXCHANGE RATE
                    </span>
                    <span className="px-1.5 py-0.5 bg-surface-container font-label-mono-sm text-[10px] text-primary uppercase">
                      BENCHMARK 8.4%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-sm my-space-xs">
                    <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                      2.1%
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-slate-denim uppercase">
                      DROP RECORD LOW
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm my-space-xs">
                    <div className="flex-1 bg-surface-container h-1.5 overflow-hidden">
                      <div className="bg-slate-denim h-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="font-label-mono-sm text-[10px] text-outline uppercase">-6.3% SPREAD</span>
                  </div>
                  <div className="pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                    <span>SELVEDGE FIT FITMENT: 98%</span>
                    <span className="text-primary uppercase font-medium">QC PASS 100%</span>
                  </div>
                </div>
              </div>

              {/* MAIN 2-COLUMN GRID (8 / 4) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                {/* PRIMARY COLUMN (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-space-lg">
                  {/* Live Drop Fulfillment Table */}
                  <div className="bg-surface-container-lowest flex flex-col">
                    <div className="p-space-md bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <span className="material-symbols-outlined text-[18px] text-primary">local_mall</span>
                        <span className="font-headline-sm text-headline-sm uppercase text-primary font-semibold tracking-tight">
                          Live Drop Fulfillment &amp; Recent Orders
                        </span>
                        <span className="px-1.5 py-0.5 bg-surface-container font-label-mono-sm text-label-mono-sm text-outline">
                          REALTIME STREAM
                        </span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <button
                          className={`px-2.5 py-1 font-label-mono-sm text-label-mono-sm uppercase transition-colors ${
                            selectedChannel === 'all'
                              ? 'bg-surface-container text-primary font-bold'
                              : 'bg-surface-dark text-outline hover:text-on-surface'
                          }`}
                          onClick={() => setSelectedChannel('all')}
                        >
                          All ({orders.length})
                        </button>
                        <button
                          className={`px-2.5 py-1 font-label-mono-sm text-label-mono-sm uppercase transition-colors ${
                            selectedChannel === 'chapel-rd'
                              ? 'bg-surface-container text-primary font-bold'
                              : 'bg-surface-dark text-outline hover:text-on-surface'
                          }`}
                          onClick={() => setSelectedChannel('chapel-rd')}
                        >
                          Flagship POS
                        </button>
                        <button
                          className={`px-2.5 py-1 font-label-mono-sm text-label-mono-sm uppercase transition-colors ${
                            selectedChannel === 'online'
                              ? 'bg-surface-container text-primary font-bold'
                              : 'bg-surface-dark text-outline hover:text-on-surface'
                          }`}
                          onClick={() => setSelectedChannel('online')}
                        >
                          Online Orders
                        </button>
                      </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                        <thead>
                          <tr className="bg-surface-dark text-outline font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
                            <th className="py-2.5 px-space-md">Order ID</th>
                            <th className="py-2.5 px-space-md">Customer / Node</th>
                            <th className="py-2.5 px-space-md">Garment Manifest</th>
                            <th className="py-2.5 px-space-md">Channel</th>
                            <th className="py-2.5 px-space-md text-right">Total Amount</th>
                            <th className="py-2.5 px-space-md text-center">Status</th>
                            <th className="py-2.5 px-space-md text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-transparent">
                          {filteredOrders.map((row) => (
                            <tr key={row.id} className="hover:bg-surface-subtle transition-colors group">
                              <td className="py-3 px-space-md font-label-mono-sm text-label-mono-sm font-semibold text-primary">
                                {row.id}
                                <div className="font-label-mono-sm text-[10px] text-outline">{row.time}</div>
                              </td>
                              <td className="py-3 px-space-md">
                                <div className="font-headline-sm text-[14px] text-on-surface font-medium">
                                  {row.customerName}
                                </div>
                                <div className="font-label-mono-sm text-[11px] text-outline uppercase">
                                  {row.location}
                                </div>
                              </td>
                              <td className="py-3 px-space-md">
                                <div className="text-on-surface truncate max-w-xs font-medium">
                                  {row.manifest}
                                </div>
                                <div className="font-label-mono-sm text-[10px] text-outline-variant">
                                  {row.itemSpecs}
                                </div>
                              </td>
                              <td className="py-3 px-space-md">
                                <span className="inline-flex items-center gap-1 font-label-mono-sm text-[11px] text-on-surface-variant uppercase">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      row.channel === 'Chapel Rd POS' ? 'bg-slate-denim' : 'bg-primary'
                                    }`}
                                  ></span>
                                  {row.channel}
                                </span>
                              </td>
                              <td className="py-3 px-space-md text-right font-label-mono-lg text-label-mono-lg text-primary font-bold">
                                ₹{row.total.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-space-md text-center">
                                <button
                                  className={`px-2 py-0.5 font-badge-caps text-badge-caps uppercase cursor-pointer hover:opacity-80 transition-opacity ${
                                    row.status === 'Awaiting Pickup'
                                      ? 'bg-rust-leather text-pure-white'
                                      : row.status === 'Processing'
                                      ? 'bg-surface-container-high text-on-surface'
                                      : row.status === 'Flagship Collected'
                                      ? 'bg-slate-denim/20 text-slate-denim'
                                      : 'bg-surface-container text-on-surface-variant'
                                  }`}
                                  onClick={() => cycleOrderStatus(row.id)}
                                  title="Click to advance status"
                                >
                                  {row.status}
                                </button>
                              </td>
                              <td className="py-3 px-space-md text-right">
                                <button
                                  className="p-1 hover:text-primary text-outline transition-colors cursor-pointer"
                                  onClick={() => {
                                    triggerToast(`Printing packing slip for ${row.id}...`);
                                    window.print();
                                  }}
                                  title="Print Shipping Label"
                                >
                                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                </button>
                                <button
                                  className="p-1 hover:text-primary text-outline transition-colors cursor-pointer"
                                  onClick={() => setSelectedOrderDetails(row)}
                                  title="Inspect Details"
                                >
                                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-space-sm bg-surface-dark flex items-center justify-between font-label-mono-sm text-label-mono-sm text-outline">
                      <span>SHOWING {filteredOrders.length} OF {orders.length} ACTIVE ORDERS</span>
                      <div className="flex items-center gap-space-sm">
                        <button className="px-2 py-1 bg-surface-subtle text-primary hover:bg-surface-container uppercase">
                          Prev
                        </button>
                        <span className="text-on-surface">PAGE 01 / 01</span>
                        <button className="px-2 py-1 bg-surface-subtle text-primary hover:bg-surface-container uppercase">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Denim Silhouette Velocity */}
                  <div className="bg-surface-container-lowest p-space-md flex flex-col gap-space-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-xs gap-space-xs">
                      <div className="flex items-center gap-space-sm">
                        <span className="material-symbols-outlined text-[18px] text-primary">styler</span>
                        <span className="font-headline-sm text-headline-sm uppercase text-primary font-semibold tracking-tight">
                          Denim Silhouette &amp; Cut Velocity
                        </span>
                      </div>
                      <div className="font-label-mono-sm text-label-mono-sm text-outline uppercase">
                        DROP 09 TOTAL DENIM VOL: <strong className="text-primary font-medium">₹4.56M</strong>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-md">
                      {/* 1 */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-baseline font-label-mono-lg text-label-mono-lg">
                          <div className="flex items-center gap-space-sm">
                            <span className="px-1.5 py-0.5 bg-primary text-pitch-black font-badge-caps text-[10px] uppercase font-bold">
                              TOP FIT
                            </span>
                            <span className="text-primary font-semibold">VINTAGE BOOTCUT // 14.5 OZ</span>
                          </div>
                          <div className="flex items-center gap-space-md">
                            <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">46% OF VOLUME</span>
                            <span className="text-primary font-bold">₹2,100,000</span>
                          </div>
                        </div>
                        <div className="w-full bg-surface-container h-2 flex">
                          <div className="bg-primary h-full transition-all duration-500" style={{ width: '46%' }}></div>
                        </div>
                        <div className="flex justify-between font-label-mono-sm text-[11px] text-outline">
                          <span>MOST POPULAR: DUST BLUE (SIZE 32)</span>
                          <span>RESTOCK FREQUENCY: CRITICAL (2 WEEKS)</span>
                        </div>
                      </div>

                      {/* 2 */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-baseline font-label-mono-lg text-label-mono-lg">
                          <div className="flex items-center gap-space-sm">
                            <span className="px-1.5 py-0.5 bg-surface-container text-on-surface font-badge-caps text-[10px] uppercase">
                              TRENDING
                            </span>
                            <span className="text-on-surface font-semibold">BAGGY FIT DENIM // RUSTIC OVERDYE</span>
                          </div>
                          <div className="flex items-center gap-space-md">
                            <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">28% OF VOLUME</span>
                            <span className="text-primary font-bold">₹1,276,800</span>
                          </div>
                        </div>
                        <div className="w-full bg-surface-container h-2 flex">
                          <div className="bg-slate-denim h-full transition-all duration-500" style={{ width: '28%' }}></div>
                        </div>
                        <div className="flex justify-between font-label-mono-sm text-[11px] text-outline">
                          <span>WAITLIST ACTIVE: 182 CUSTOMERS</span>
                          <span>PRODUCTION BATCH #02 IN TRANSIT</span>
                        </div>
                      </div>

                      {/* 3 */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-baseline font-label-mono-lg text-label-mono-lg">
                          <div className="flex items-center gap-space-sm">
                            <span className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant font-badge-caps text-[10px] uppercase">
                              CORE ARCHIVE
                            </span>
                            <span className="text-on-surface font-semibold">STRAIGHT FIT 15.5 OZ SELVEDGE</span>
                          </div>
                          <div className="flex items-center gap-space-md">
                            <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">18% OF VOLUME</span>
                            <span className="text-primary font-bold">₹820,800</span>
                          </div>
                        </div>
                        <div className="w-full bg-surface-container h-2 flex">
                          <div className="bg-outline h-full transition-all duration-500" style={{ width: '18%' }}></div>
                        </div>
                        <div className="flex justify-between font-label-mono-sm text-[11px] text-outline">
                          <span>STABLE RUNNER // ZERO DISCOUNT POLICY</span>
                          <span>INVENTORY DEPTH: SUFFICIENT</span>
                        </div>
                      </div>

                      {/* 4 */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-baseline font-label-mono-lg text-label-mono-lg">
                          <div className="flex items-center gap-space-sm">
                            <span className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant font-badge-caps text-[10px] uppercase">
                              NICHE EXPERIMENTAL
                            </span>
                            <span className="text-on-surface font-semibold">BARREL &amp; FLARED ARCHIVE</span>
                          </div>
                          <div className="flex items-center gap-space-md">
                            <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">8% OF VOLUME</span>
                            <span className="text-primary font-bold">₹364,800</span>
                          </div>
                        </div>
                        <div className="w-full bg-surface-container h-2 flex">
                          <div className="bg-surface-bright h-full transition-all duration-500" style={{ width: '8%' }}></div>
                        </div>
                        <div className="flex justify-between font-label-mono-sm text-[11px] text-outline">
                          <span>FLAGSHIP IN-STORE CONVERSION LEAD</span>
                          <span>LIMITED RUN ONLY // 150 TOTAL CUT</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Raw Material Allocation Notice */}
                  <div className="bg-surface-container-lowest p-space-md flex flex-col md:flex-row gap-space-md items-center justify-between">
                    <div className="w-full md:w-48 h-32 bg-surface-subtle overflow-hidden relative flex-shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFrRAr1ZnWJ_hzpxCIU6Ch9XhRVqTnm820YL-h8P_VpIrzeVbR_SFuxS_zutNILlytEKjcYYbsj71cnvjC9kjwEphCq4Fdy87H3qrQRWg2eoh47ZSaLdTx9X4rieRoa1Ha3XVsoWc7DZ1KcogxUgrB0LeDkUODVUkuWMcs6xR6hbWz8ffuc2ZxwJU_WLojxoHWVm3P_Ogmg_SFLtDtdrrYfKPAyrv6BgzZjm7pfno"
                        alt="Raw denim mill run"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-pitch-black/80 font-label-mono-sm text-[10px] text-pure-white uppercase">
                        ARCHIVE 09
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="font-label-mono-sm text-label-mono-sm text-rust-leather uppercase font-semibold">
                        RAW MATERIAL ALLOCATION
                      </div>
                      <div className="font-headline-sm text-headline-sm text-primary uppercase font-bold tracking-tight">
                        BATCH #03 MILL RUN SCHEDULED
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        Import of 800m of Kuroki Mills Japanese raw shuttle selvedge arriving at Bhiwandi warehousing on Thursday. Slated for the Vintage Bootcut restock run.
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 bg-surface-container text-on-surface hover:text-primary hover:bg-surface-container-high font-label-mono-sm text-label-mono-sm uppercase transition-colors whitespace-nowrap cursor-pointer"
                      onClick={() => triggerToast('Mill PO #901: 800m Kuroki Selvedge confirmed')}
                    >
                      View Mill PO #901
                    </button>
                  </div>
                </div>

                {/* SECONDARY COLUMN (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-space-lg">
                  {/* Stock Depletion Matrix */}
                  <div className="bg-surface-container-lowest p-space-md flex flex-col gap-space-md">
                    <div className="flex items-center justify-between pb-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[18px] text-error">warning</span>
                        <span className="font-headline-sm text-headline-sm uppercase text-primary font-semibold tracking-tight">
                          Stock Depletion Matrix
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[10px] text-error font-semibold uppercase">
                        ACTION REQ
                      </span>
                    </div>

                    {stockSkus.map((sku) => (
                      <div key={sku.id} className="bg-surface-dark p-space-sm flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase font-bold">
                            {sku.name}
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-error uppercase font-medium">
                            {sku.tag}
                          </span>
                        </div>
                        <span className="font-label-mono-sm text-[10px] text-outline">SKU: {sku.sku}</span>

                        <div className="grid grid-cols-5 gap-1 pt-1">
                          {sku.sizes.map((s) => (
                            <button
                              key={s.size}
                              className={`p-1.5 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                                s.status === 'OUT'
                                  ? 'bg-surface-container-low opacity-40'
                                  : s.status === 'CRIT'
                                  ? 'bg-rust-leather/20 border border-rust-leather'
                                  : 'bg-surface-container'
                              }`}
                              onClick={() => handleRestockSKU(sku.id, s.size, 10)}
                              title="Click to add +10 units"
                            >
                              <span className="font-label-mono-sm text-[10px] text-outline uppercase">{s.size}</span>
                              <span
                                className={`font-headline-sm text-[13px] font-bold ${
                                  s.status === 'OUT' ? 'text-error' : s.status === 'CRIT' ? 'text-pure-white' : 'text-primary'
                                }`}
                              >
                                {s.count}
                              </span>
                              <span className="font-label-mono-sm text-[9px] text-outline">{s.status}</span>
                            </button>
                          ))}
                        </div>

                        <button
                          className="mt-2 w-full py-1.5 bg-rust-leather hover:bg-rust-leather/90 text-pure-white font-label-mono-sm text-label-mono-sm uppercase font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          onClick={() => {
                            sku.sizes.forEach((s) => handleRestockSKU(sku.id, s.size, 15));
                            triggerToast(`✓ Pre-order batch triggered for ${sku.name}`);
                          }}
                        >
                          <span className="material-symbols-outlined text-[15px]">bolt</span>
                          <span>Trigger Restock (+15 units)</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Bandra Flagship Store POS Feed */}
                  <div className="bg-surface-container-lowest p-space-md flex flex-col gap-space-md">
                    <div className="flex items-center justify-between pb-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[18px] text-slate-denim">storefront</span>
                        <span className="font-headline-sm text-headline-sm uppercase text-primary font-semibold tracking-tight">
                          Chapel Rd Flagship Live
                        </span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-slate-denim animate-pulse"></span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-surface-dark p-space-sm">
                      <div className="flex flex-col">
                        <span className="font-label-mono-sm text-[10px] text-outline uppercase">FOOTFALL</span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">94</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-mono-sm text-[10px] text-outline uppercase">CONVERSIONS</span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">38 (40%)</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-mono-sm text-[10px] text-outline uppercase">POS REVENUE</span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">₹1.18L</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                        <span className="text-outline uppercase">LEAD ON DUTY</span>
                        <span className="text-primary font-medium">KARAN S. [FLOOR MANAGER]</span>
                      </div>
                      <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                        <span className="text-outline uppercase">FITTING ROOM QUEUE</span>
                        <span className="text-on-surface">3 OCCUPIED / 1 WAITING</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-space-xs">
                      <span className="font-label-mono-sm text-[10px] text-outline uppercase tracking-wider">
                        LATEST TERMINAL POS HITS
                      </span>
                      {posHits.map((hit) => (
                        <div key={hit.id} className="bg-surface-subtle p-2 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-headline-sm text-[13px] text-primary">{hit.title}</span>
                            <span className="font-label-mono-sm text-[10px] text-outline">{hit.terminal}</span>
                          </div>
                          <span className="font-label-mono-lg text-label-mono-lg text-primary font-bold">
                            ₹{hit.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry */}
                  <div className="bg-surface-container-lowest p-space-md flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline">
                        NETWORK &amp; CARRIER TELEMETRY
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase font-bold">
                        99.8% UPTIME
                      </span>
                    </div>
                    <div className="space-y-2 pt-1 font-label-mono-sm text-label-mono-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          DELHIVERY AIR API
                        </span>
                        <span className="text-primary font-mono">18 MS LATENCY</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          BLUEDART SURFACE B2C
                        </span>
                        <span className="text-primary font-mono">32 MS LATENCY</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          PAYMENT GATEWAY (RAZORPAY)
                        </span>
                        <span className="text-primary font-mono">OPERATIONAL</span>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-surface-dark flex items-center justify-between font-label-mono-sm text-[11px]">
                      <span className="text-outline uppercase">NEXT DISPATCH DISPATCH VEHICLE</span>
                      <span className="text-primary font-bold uppercase">17:00 IST (PICKUP #02)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL: + NEW DROP / SKU */}
      {isNewDropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-pitch-black/80 backdrop-blur-md" onClick={() => setIsNewDropModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-dark border border-line-subtle p-5 z-10 shadow-2xl">
            <h3 className="font-headline-sm text-lg uppercase font-bold text-primary mb-3">
              Deploy New Archival Drop / SKU
            </h3>
            <form onSubmit={handleCreateNewDrop} className="space-y-3 font-label-mono-sm text-xs">
              <div>
                <label className="text-outline uppercase block mb-1">Product Title</label>
                <input
                  required
                  className="w-full bg-surface-subtle border border-line-subtle p-2 text-pure-white outline-none focus:border-primary"
                  value={newDropForm.name}
                  onChange={(e) => setNewDropForm({ ...newDropForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-outline uppercase block mb-1">Retail Price (₹)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-surface-subtle border border-line-subtle p-2 text-pure-white outline-none focus:border-primary"
                    value={newDropForm.price}
                    onChange={(e) => setNewDropForm({ ...newDropForm, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-outline uppercase block mb-1">Initial Stock / Size</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-surface-subtle border border-line-subtle p-2 text-pure-white outline-none focus:border-primary"
                    value={newDropForm.stockCount}
                    onChange={(e) => setNewDropForm({ ...newDropForm, stockCount: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-surface-container text-on-surface"
                  onClick={() => setIsNewDropModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-pitch-black font-bold uppercase">
                  Deploy to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LIVE POS IN-STORE SALE */}
      {isPosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-pitch-black/80 backdrop-blur-md" onClick={() => setIsPosModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-dark border border-line-subtle p-5 z-10 shadow-2xl">
            <h3 className="font-headline-sm text-lg uppercase font-bold text-primary mb-3">
              Chapel Rd Live POS Register
            </h3>
            <form onSubmit={handleProcessPos} className="space-y-3 font-label-mono-sm text-xs">
              <div>
                <label className="text-outline uppercase block mb-1">Select Garment / Cut</label>
                <select
                  className="w-full bg-surface-subtle border border-line-subtle p-2 text-pure-white outline-none focus:border-primary"
                  value={posForm.item}
                  onChange={(e) => setPosForm({ ...posForm, item: e.target.value })}
                >
                  <option value="Vintage Bootcut (Dust Blue - 32)">Vintage Bootcut (Dust Blue - 32) - ₹1,199</option>
                  <option value="Baggy Fit Denim (Rustic Wash - 30)">Baggy Fit Denim (Rustic Wash - 30) - ₹3,199</option>
                  <option value="Drive Jacket (Burgundy - M)">Drive Jacket (Burgundy - M) - ₹7,649</option>
                  <option value="Washed Olive Tee (L)">Washed Olive Tee (L) - ₹899</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-outline uppercase block mb-1">Final Total (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-surface-subtle border border-line-subtle p-2 text-pure-white outline-none focus:border-primary"
                    value={posForm.price}
                    onChange={(e) => setPosForm({ ...posForm, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-outline uppercase block mb-1">Payment Method</label>
                  <select
                    className="w-full bg-surface-subtle border border-line-subtle p-2 text-pure-white outline-none focus:border-primary"
                    value={posForm.method}
                    onChange={(e) => setPosForm({ ...posForm, method: e.target.value })}
                  >
                    <option value="upi">UPI Scan</option>
                    <option value="card">Card Swipe</option>
                    <option value="cash">Cash Counter</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-surface-container text-on-surface"
                  onClick={() => setIsPosModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-pitch-black font-bold uppercase">
                  Complete In-Store Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS INSPECTOR */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-pitch-black/80 backdrop-blur-md" onClick={() => setSelectedOrderDetails(null)} />
          <div className="relative w-full max-w-lg bg-surface-dark border border-line-subtle p-5 z-10 shadow-2xl space-y-3 font-label-mono-sm text-xs">
            <div className="flex justify-between items-center border-b border-line-subtle pb-2">
              <span className="font-headline-sm text-base uppercase font-bold text-primary">
                Order Manifest {selectedOrderDetails.id}
              </span>
              <button
                className="text-outline hover:text-pure-white"
                onClick={() => setSelectedOrderDetails(null)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-1.5">
              <p><span className="text-outline">Customer:</span> <strong className="text-pure-white">{selectedOrderDetails.customerName}</strong></p>
              <p><span className="text-outline">Address:</span> <strong className="text-pure-white">{selectedOrderDetails.location}</strong></p>
              <p><span className="text-outline">Garment:</span> <strong className="text-primary">{selectedOrderDetails.manifest}</strong></p>
              <p><span className="text-outline">Specs:</span> {selectedOrderDetails.itemSpecs}</p>
              <p><span className="text-outline">Channel:</span> {selectedOrderDetails.channel}</p>
              <p><span className="text-outline">Total Value:</span> <strong className="text-primary">₹{selectedOrderDetails.total.toLocaleString('en-IN')}</strong></p>
              <p><span className="text-outline">Fulfillment Status:</span> <strong className="text-secondary">{selectedOrderDetails.status}</strong></p>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-rust-leather text-pure-white uppercase font-bold"
                onClick={() => {
                  cycleOrderStatus(selectedOrderDetails.id);
                  setSelectedOrderDetails(null);
                }}
              >
                Advance Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
