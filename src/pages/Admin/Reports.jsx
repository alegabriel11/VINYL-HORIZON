import React, { useRef, useState, useEffect } from "react";
import AdminSidebar from "./cart/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import TopBarUser from "../../components/TopBarUser";
import AdminNotifications from "../../components/AdminNotifications";
import { Link } from "react-router-dom";

const generateChartPaths = (data) => {
  if (!data || data.length === 0) return { line: "", fill: "", points: [] };
  const maxVal = Math.max(...data, 100);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 800;
    const y = 180 - ((val / maxVal) * 160);
    return { x, y, val };
  });

  let linePath = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    linePath += ` C${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
  }

  const fillPath = `${linePath} L800,200 L0,200 Z`;

  return { line: linePath, fill: fillPath, points };
};

export default function Reports() {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const printRef = useRef();

  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    avgOrderValue: 0,
    customersCount: 0,
    topVinyls: [],
    genres: [],
    chartData: Array(6).fill(0),
    chartLabels: ["", "", "", "", "", ""]
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [ordersRes, vinylsRes] = await Promise.all([
          fetch('/api/vinyls/orders'),
          fetch('/api/vinyls')
        ]);

        if (ordersRes.ok && vinylsRes.ok) {
          const orders = await ordersRes.json();
          const vinyls = await vinylsRes.json();

          let totalRev = 0;
          let uniqueCustomers = new Set();
          let itemMap = {}; // { vinylId: { qty: 0, rev: 0 } }

          orders.forEach(o => {
            totalRev += parseFloat(o.total_amount || 0);
            if (o.user_id && o.user_id !== 'guest') uniqueCustomers.add(o.user_id);
            else if (o.customer_name) uniqueCustomers.add(o.customer_name);

            const items = o.items ? (typeof o.items === 'string' ? JSON.parse(o.items) : o.items) : [];
            items.forEach(item => {
              if (!itemMap[item.id]) itemMap[item.id] = { qty: 0, rev: 0 };
              itemMap[item.id].qty += item.quantity || 1;
              // we don't store price in items directly, so we map from vinyls list
              const v = vinyls.find(vi => vi.id === item.id);
              if (v) itemMap[item.id].rev += (parseFloat(v.price || 0) * (item.quantity || 1));
            });
          });

          // Top Vinyls
          const vinylsArray = Object.keys(itemMap).map(id => {
            const v = vinyls.find(vi => vi.id === id) || {};
            return {
              id,
              title: v.title || 'Unknown',
              genre: v.genre || 'Various',
              cover: v.cover_image_url || '',
              units: itemMap[id].qty,
              revenue: itemMap[id].rev
            };
          }).sort((a, b) => b.units - a.units);

          // By Genre
          let genreTotals = {};
          let totalStr = 0;
          vinylsArray.forEach(v => {
            if (!genreTotals[v.genre]) genreTotals[v.genre] = 0;
            genreTotals[v.genre] += v.units;
            totalStr += v.units;
          });

          const genresArr = Object.keys(genreTotals).map(g => ({
            name: g,
            percentage: totalStr > 0 ? (genreTotals[g] / totalStr) * 100 : 0
          })).sort((a, b) => b.percentage - a.percentage).slice(0, 4);

          // Calculate 6-month revenue chart
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const monthlyData = [];
          const currentDate = new Date();

          for (let i = 5; i >= 0; i--) {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            monthlyData.push({ monthKey: `${d.getFullYear()}-${d.getMonth()}`, label: monthNames[d.getMonth()], sales: 0 });
          }

          orders.forEach(order => {
            if (order.created_at) {
              const d = new Date(order.created_at);
              const mKey = `${d.getFullYear()}-${d.getMonth()}`;
              const mt = monthlyData.find(m => m.monthKey === mKey);
              if (mt) {
                mt.sales += parseFloat(order.total_amount || 0);
              }
            }
          });

          const chartData = monthlyData.map(m => m.sales);
          const chartLabels = monthlyData.map(m => m.label);

          setReportData({
            totalRevenue: totalRev,
            avgOrderValue: orders.length ? (totalRev / orders.length) : 0,
            customersCount: uniqueCustomers.size,
            topVinyls: vinylsArray.slice(0, 3), // Top 3
            genres: genresArr,
            chartData,
            chartLabels
          });
        }
      } catch (err) {
        console.error('Error fetching report data:', err);
      }
    };
    fetchReportData();
  }, []);

  const handleGenerateFullReport = async () => {
    try {
      toast.loading('Capturing data & generating report...', { id: 'report-gen' });
      const doc = new jsPDF();

      // Styling and Headers
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(11, 27, 42); // #0B1B2A
      doc.text("VINYL HORIZON - EXECUTIVE REPORT", 14, 22);

      // Subtitle
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 32);
      doc.text(`Generated by: Store Manager (Admin Terminal Luxe v1.2)`, 14, 38);

      // Line break
      doc.setDrawColor(200);
      doc.line(14, 45, 196, 45);

      // --- Executive Summary ---
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text("1. Executive Summary", 14, 55);

      autoTable(doc, {
        startY: 60,
        head: [['Key Metric', 'Current Value', 'MoM Growth']],
        body: [
          ['Total Revenue', '$48,295.50', '+14.2%'],
          ['Average Order Value', '$42.80', '+5.7%'],
          ['Customer Database', '1,204 Active', '+22.1%'],
          ['Low Stock Alerts', '4 Items', 'Action Required'],
        ],
        theme: 'striped',
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [94, 25, 20], textColor: [255, 255, 255] } // #5E1914 Theme
      });

      // --- Sales by Genre ---
      doc.text("2. Monthly Volume by Genre", 14, doc.lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Genre', 'Distribution %', 'Trend']],
        body: [
          ['Jazz', '45%', 'Stable'],
          ['Rock', '25%', 'Declining'],
          ['Electronica', '20%', 'Growing'],
          ['Classical', '10%', 'Stable']
        ],
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [11, 27, 42], textColor: [255, 255, 255] } // #0B1B2A Theme
      });

      // --- Top Sellers ---
      doc.text("3. Top Performing Vinyls", 14, doc.lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Album Title', 'Genre', 'Units Sold', 'Gross Revenue']],
        body: [
          ['Midnight Melodies', 'Jazz', '84', '$2,856.00'],
          ['Blue Jazz Nights', 'Jazz', '65', '$2,730.00'],
          ['Urban Echoes', 'Rock', '72', '$2,052.00']
        ],
        theme: 'striped',
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [94, 25, 20], textColor: [255, 255, 255] }
      });

      // --- Visual Monthly Growth ---
      if (doc.lastAutoTable.finalY > 200) {
        doc.addPage();
        doc.text("4. Monthly Growth Chart", 14, 20);
      } else {
        doc.text("4. Monthly Growth Chart", 14, doc.lastAutoTable.finalY + 15);
      }

      const chartElement = document.getElementById('monthly-growth-chart');
      if (chartElement) {
        const dataUrl = await toPng(chartElement, {
          backgroundColor: isDark ? '#3A2E29' : '#D9D9D9',
          pixelRatio: 2
        });

        const imgWidth = 180;
        // Approximation or measure image dimensions if needed
        const imgHeight = (chartElement.offsetHeight * imgWidth) / chartElement.offsetWidth;

        const currentY = doc.lastAutoTable.finalY > 200 ? 25 : doc.lastAutoTable.finalY + 20;
        doc.addImage(dataUrl, 'PNG', 14, currentY, imgWidth, imgHeight);
      }

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`CONFIDENTIAL - Vinyl Horizon Internal Use Only • Page ${i} of ${totalPages}`, 14, 285);
      }

      // Download
      doc.save(`VinylHorizon_Report_${new Date().getTime()}.pdf`);
      toast.success('Executive Report downloaded securely!', { id: 'report-gen', icon: '📉' });

    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report module', { id: 'report-gen' });
    }
  };

  return (
    <div className="min-h-screen selection:bg-rose-fog selection:text-black-pearl bg-[#E1E5F0] dark:bg-[#091C2A] text-[#0B1B2A] dark:text-[#E1C2B3] transition-colors font-['Montserrat']">
      <style>{`
        @media print {
          body.printing-monthly-growth * {
            visibility: hidden;
          }
          body.printing-monthly-growth .pdf-export-container, 
          body.printing-monthly-growth .pdf-export-container * {
            visibility: visible;
          }
          body.printing-monthly-growth .pdf-export-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
            background: ${isDark ? '#3A2E29' : '#D9D9D9'} !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body.printing-monthly-growth .pdf-hide-on-print {
            display: none !important;
          }
        }
      `}</style>
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8 lg:p-12 relative" id="main-content">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-5xl font-bold">{t('admin.reports')}</h1>
            <p className="font-variant-small-caps text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-sm tracking-[0.3em] mt-1 font-semibold">{t('admin.terminal')}</p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={handleGenerateFullReport}
              className="px-6 py-3 bg-[#0B1B2A] dark:bg-rose-fog text-[#F3F0EC] dark:text-black-pearl text-[10px] font-bold uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              {t('admin.generate_full')}
            </button>
            <AdminNotifications />

            <div className="border-l border-[#3A2E29]/30 pl-6">
              <TopBarUser />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-6 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-[#5E1914]/10 rounded-lg">
                <span className="material-symbols-outlined text-[#5E1914]">payments</span>
              </div>
            </div>
            <p className="text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-[10px] font-bold uppercase tracking-widest">Total Revenue</p>
            <h3 className="font-['Playfair_Display'] text-3xl mt-1">${reportData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-6 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-[#5E1914]/10 rounded-lg">
                <span className="material-symbols-outlined text-[#5E1914]">shopping_cart</span>
              </div>
            </div>
            <p className="text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-[10px] font-bold uppercase tracking-widest">Avg. Order Value</p>
            <h3 className="font-['Playfair_Display'] text-3xl mt-1">${reportData.avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-6 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-[#5E1914]/10 rounded-lg">
                <span className="material-symbols-outlined text-[#5E1914]">group_add</span>
              </div>
            </div>
            <p className="text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-[10px] font-bold uppercase tracking-widest">Unique Customers</p>
            <h3 className="font-['Playfair_Display'] text-3xl mt-1">{reportData.customersCount}</h3>
          </div>
        </div>

        <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-8 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl mb-8 transition-all">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold">{t('admin.sales_by_genre')}</h4>
              <p className="text-[10px] text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 uppercase tracking-[0.2em]">Distribution of monthly volume</p>
            </div>
          </div>
          <div className="flex items-end justify-between h-64 gap-8 px-4">
            {reportData.genres.map((g, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                <div className="w-full bg-[#5E1914] rounded-t-lg transition-all duration-500 group-hover:opacity-80 shadow-lg" style={{ height: `${Math.max(g.percentage, 5)}%` }}></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">{g.name} ({Math.round(g.percentage)}%)</span>
              </div>
            ))}
            {reportData.genres.length === 0 && <p className="text-center w-full mt-24 text-[10px] uppercase font-bold text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">No genre data available</p>}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-8 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold">{t('admin.top_selling')}</h4>
              <span className="material-symbols-outlined text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 cursor-pointer">more_horiz</span>
            </div>
            <div className="space-y-6">
              {reportData.topVinyls.length === 0 ? (
                <p className="text-[10px] uppercase font-bold text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">No sales data yet.</p>
              ) : reportData.topVinyls.map((v, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-black/10 dark:bg-black-pearl/40 overflow-hidden shadow-md">
                    <img alt="Album" className="w-full h-full object-cover" src={v.cover || "https://images.unsplash.com/photo-1603048588665-791ca8aea617?fit=crop&q=80&w=200&h=200"} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold">{v.title}</h5>
                    <p className="text-[10px] text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 uppercase tracking-widest">{v.genre} • {v.units} Units</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${v.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-8 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all h-full pdf-export-container" style={{ background: isDark ? '#3A2E29' : '#D9D9D9' }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold">{t('admin.monthly_growth')}</h4>
                <p className="text-[10px] text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 uppercase tracking-[0.2em]">6 month trajectory</p>
              </div>
            </div>
            <div id="monthly-growth-chart" className="h-48 w-full relative pt-4 px-4 pb-4">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                <defs>
                  <linearGradient id="growthGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={isDark ? "#ef4444" : "#5E1914"} stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor={isDark ? "#ef4444" : "#5E1914"} stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d={generateChartPaths(reportData.chartData).line} fill="none" stroke={isDark ? "#ef4444" : "#5E1914"} strokeWidth="3"></path>
                <path d={generateChartPaths(reportData.chartData).fill} fill="url(#growthGradient)"></path>
                {generateChartPaths(reportData.chartData).points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} fill={isDark ? "#ef4444" : "#5E1914"} r="5" stroke={isDark ? "#3A2E29" : "#D9D9D9"} strokeWidth="2"></circle>
                    <text x={Math.max(20, Math.min(p.x, 780))} y={p.y > 30 ? p.y - 12 : p.y + 20} fill={isDark ? "#E1C2B3" : "#0B1B2A"} fontSize="12" textAnchor="middle" fontWeight="bold">
                      ${p.val.toFixed(0)}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="flex justify-between mt-6 text-[9px] uppercase font-bold tracking-[0.2em] text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 px-2">
                {reportData.chartLabels.map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
