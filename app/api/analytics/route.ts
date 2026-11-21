import { NextResponse } from 'next/server';

export async function GET() {
  const metrics = {
    grossRevenueToday: 482450,
    onlineRevenue: 364000,
    chapelRdRevenue: 118450,
    revenueGrowthPercent: '+18.4% DROP CYCLE',
    activeDenimInventoryUnits: 1420,
    activeSkusCount: 106,
    criticalRestockCount: 28,
    lowStockCount: 84,
    queuedFulfillmentShipments: 184,
    expressPriority: 42,
    packedReady: 112,
    inAudit: 30,
    packRatePercent: 92,
    returnRatePercent: 2.1,
    benchmarkReturnRate: 8.4,
    fitmentPassRate: 98,
    qcPassRate: 100,
    footfall: 94,
    conversions: 38,
    conversionRate: '40%',
    leadOnDuty: 'KARAN S. [FLOOR MANAGER]',
    fittingRoomQueue: '3 OCCUPIED / 1 WAITING',
    telemetry: {
      delhiveryLatency: '18 MS',
      blueDartLatency: '32 MS',
      razorpayStatus: 'OPERATIONAL',
      nextPickup: '17:00 IST (PICKUP #02)'
    }
  };

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    metrics,
  });
}
