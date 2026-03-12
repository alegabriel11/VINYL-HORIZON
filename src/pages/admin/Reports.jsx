import React, { useRef, useState, useEffect } from "react";
import AdminSidebar from "./cart/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import TopBarUser from "../../components/user/TopBarUser";
import AdminNotifications from "../../components/admin/AdminNotifications";
import { Link } from "react-router-dom";

// Removed generateChartPaths function as it's no longer used

export default function Reports() {
  const { isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
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
          const lng = i18n.language || 'en';
          const monthlyData = [];
          const currentDate = new Date();

          for (let i = 5; i >= 0; i--) {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthLabel = new Intl.DateTimeFormat(lng, { month: 'short' }).format(d);
            monthlyData.push({ monthKey: `${d.getFullYear()}-${d.getMonth()}`, label: monthLabel, sales: 0 });
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
      toast.loading(t('admin.provisioning', 'Procesando...'), { id: 'report-gen' });
      const doc = new jsPDF();

      // Premium Header Banner
      doc.setFillColor(11, 27, 42); // #0B1B2A
      doc.rect(0, 0, 210, 45, 'F');

      // Title
      doc.setFontSize(28);
      doc.setFont('times', 'bold');
      doc.setTextColor(225, 194, 179); // #E1C2B3
      doc.text("VINYL HORIZON", 14, 22);

      doc.setFontSize(12);
      doc.setFont('times', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text(t('admin.reports.pdf.executive_title', 'EXECUTIVE INTELLIGENCE REPORT'), 14, 32);

      // Subtitle outside banner
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text(t('admin.reports.pdf.generated_by', {
        date: new Date().toLocaleDateString(i18n.language),
        time: new Date().toLocaleTimeString(i18n.language)
      }), 14, 55);

      // Calculations for dynamic data
      const currentMonthSales = reportData.chartData[5] || 0;
      const prevMonthSales = reportData.chartData[4] || 0;
      let revenueGrowth = "-";
      if (prevMonthSales > 0) {
        const growth = ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100;
        revenueGrowth = `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
      }

      // --- Executive Summary ---
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.setTextColor(11, 27, 42);
      doc.text(t('admin.reports.pdf.summary_title', '1. Executive Summary'), 14, 68);

      autoTable(doc, {
        startY: 72,
        head: [[
          t('admin.reports.pdf.metric_header', 'Key Metric'),
          t('admin.reports.pdf.value_header', 'Current Value'),
          t('admin.reports.pdf.mom_header', 'MoM Growth')
        ]],
        body: [
          [t('admin.reports.total_revenue', 'Total Revenue'), `$${reportData.totalRevenue.toLocaleString(i18n.language || 'en-US', { minimumFractionDigits: 2 })}`, revenueGrowth],
          [t('admin.reports.avg_order', 'Average Order Value'), `$${reportData.avgOrderValue.toLocaleString(i18n.language || 'en-US', { minimumFractionDigits: 2 })}`, '-'],
          [t('admin.reports.unique_customers', 'Unique Customers'), `${reportData.customersCount}`, '-'],
        ],
        theme: 'striped',
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [94, 25, 20], textColor: [255, 255, 255], font: 'times', fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [243, 240, 236] }
      });

      // --- Sales by Genre ---
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.setTextColor(11, 27, 42);
      doc.text(t('admin.reports.pdf.genre_title', '2. Monthly Volume by Genre'), 14, doc.lastAutoTable.finalY + 15);

      const genreBody = reportData.genres.map(g => [g.name, `${g.percentage.toFixed(1)}%`, 'Active']);
      if (genreBody.length === 0) genreBody.push([t('admin.reports.no_genre_data', 'No Data Available'), '0%', '-']);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [[
          t('admin.reports.pdf.genre_header', 'Genre'),
          t('admin.reports.pdf.dist_header', 'Distribution %'),
          t('admin.reports.pdf.status_header', 'Status')
        ]],
        body: genreBody,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [11, 27, 42], textColor: [255, 255, 255], font: 'times', fontStyle: 'bold' }
      });

      // --- Top Sellers ---
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.setTextColor(11, 27, 42);
      doc.text(t('admin.reports.pdf.top_title', '3. Top Performing Vinyls'), 14, doc.lastAutoTable.finalY + 15);

      const topSellersBody = reportData.topVinyls.map(v => [
        v.title,
        v.genre,
        v.units.toString(),
        `$${v.revenue.toLocaleString(i18n.language || 'en-US', { minimumFractionDigits: 2 })}`
      ]);
      if (topSellersBody.length === 0) topSellersBody.push([t('admin.reports.top_selling_empty', 'No Sales Data'), '-', '0', '$0.00']);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [[
          t('admin.reports.pdf.album_header', 'Album Title'),
          t('admin.table_genre', 'Genre'),
          t('admin.reports.pdf.units_header', 'Units Sold'),
          t('admin.reports.pdf.gross_header', 'Gross Revenue')
        ]],
        body: topSellersBody,
        theme: 'striped',
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [94, 25, 20], textColor: [255, 255, 255], font: 'times', fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [243, 240, 236] }
      });

      // --- Visual Monthly Growth ---
      if (doc.lastAutoTable.finalY > 200) {
        doc.addPage();
        doc.text(t('admin.reports.pdf.growth_title', '4. Monthly Growth Chart'), 14, 20);
      } else {
        doc.text(t('admin.reports.pdf.growth_title', '4. Monthly Growth Chart'), 14, doc.lastAutoTable.finalY + 15);
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
        doc.text(t('admin.reports.pdf.confidential', { page: i, total: totalPages }), 14, 285);
      }

      // Download
      doc.save(`VinylHorizon_Report_${new Date().getTime()}.pdf`);
      toast.success(t('admin.reports.pdf.download_success', 'Executive Report downloaded securely!'), { id: 'report-gen', icon: '📉' });

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
            <h1 className="font-['Cormorant_Garamond'] text-5xl font-bold">{t('admin.reports.title', 'Reports & Analytics')}</h1>
            <p className="font-variant-small-caps text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-sm tracking-[0.3em] mt-1 font-semibold">{t('admin.terminal', 'Admin Terminal')}</p>
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
              <TopBarUser isFixed={false} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-6 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-black-pearl/20 rounded-lg">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">payments</span>
              </div>
            </div>
            <p className="text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-[10px] font-bold uppercase tracking-widest">{t('admin.reports.total_revenue', 'Total Revenue')}</p>
            <h3 className="font-['Playfair_Display'] text-3xl mt-1">${reportData.totalRevenue.toLocaleString(i18n.language || 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-6 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-black-pearl/20 rounded-lg">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">shopping_cart</span>
              </div>
            </div>
            <p className="text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-[10px] font-bold uppercase tracking-widest">{t('admin.reports.avg_order', 'Avg. Order Value')}</p>
            <h3 className="font-['Playfair_Display'] text-3xl mt-1">${reportData.avgOrderValue.toLocaleString(i18n.language || 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-6 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-black-pearl/20 rounded-lg">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">group_add</span>
              </div>
            </div>
            <p className="text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-[10px] font-bold uppercase tracking-widest">{t('admin.reports.unique_customers', 'Unique Customers')}</p>
            <h3 className="font-['Playfair_Display'] text-3xl mt-1">{reportData.customersCount}</h3>
          </div>
        </div>

        <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-8 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl mb-8 transition-all">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold">{t('admin.sales_by_genre')}</h4>
              <p className="text-[10px] text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 uppercase tracking-[0.2em]">{t('admin.reports.sales_by_genre_desc', 'Distribution of monthly volume')}</p>
            </div>
          </div>
          <div className="flex items-end justify-between h-64 gap-8 px-4">
            {reportData.genres.map((g, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                <div className="w-full bg-[#5E1914] rounded-t-lg transition-all duration-500 group-hover:opacity-80 shadow-lg" style={{ height: `${Math.max(g.percentage, 5)}%` }}></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">{g.name} ({Math.round(g.percentage)}%)</span>
              </div>
            ))}
            {reportData.genres.length === 0 && <p className="text-center w-full mt-24 text-[10px] uppercase font-bold text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">{t('admin.reports.no_genre_data', 'No genre data available')}</p>}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-8 rounded-[1rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-xl transition-all">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold">{t('admin.top_selling')}</h4>
            </div>
            <div className="space-y-6">
              {reportData.topVinyls.length === 0 ? (
                <p className="text-[10px] uppercase font-bold text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">{t('admin.reports.top_selling_empty', 'No sales data yet.')}</p>
              ) : reportData.topVinyls.map((v, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-black/10 dark:bg-black-pearl/40 overflow-hidden shadow-md">
                    <img alt="Album" className="w-full h-full object-cover" src={v.cover || "https://images.unsplash.com/photo-1603048588665-791ca8aea617?fit=crop&q=80&w=200&h=200"} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold">{v.title}</h5>
                    <p className="text-[10px] text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 uppercase tracking-widest">{v.genre} • {v.units} {t('admin.units', 'Units')}</p>
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
                <p className="text-[10px] text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 uppercase tracking-[0.2em]">{t('admin.reports.monthly_growth_desc', '6 month trajectory')}</p>
              </div>
            </div>
            <div id="monthly-growth-chart" className="h-[280px] w-full relative pt-4 pb-4">
              {(() => {
                const data = reportData.chartData;
                const maxVal = Math.max(...data, 10) * 1.15; // 15% padding top
                const points = data.map((val, i) => {
                  const x = 50 + (i / (data.length - 1)) * 680; // left 50, right 50
                  const y = 220 - ((val / maxVal) * 180); // top 40, bottom 40
                  return { x, y, val };
                });

                let linePath = `M${points[0]?.x || 0},${points[0]?.y || 0}`;
                for (let i = 1; i < points.length; i++) {
                  const p0 = points[i - 1];
                  const p1 = points[i];
                  const cx = (p0.x + p1.x) / 2;
                  linePath += ` C${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
                }
                const fillPath = `${linePath} L${points[points.length - 1]?.x || 0},220 L${points[0]?.x || 0},220 Z`;

                const gridLines = [];
                for (let i = 0; i <= 4; i++) {
                  const y = 220 - (i / 4) * 180;
                  const val = (maxVal * (i / 4));
                  gridLines.push({ y, val });
                }

                return (
                  <svg className="w-full h-full" viewBox="0 0 800 260" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="growthGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={isDark ? "#ef4444" : "#5E1914"} stopOpacity="0.25"></stop>
                        <stop offset="100%" stopColor={isDark ? "#ef4444" : "#5E1914"} stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>

                    {/* Grid */}
                    {gridLines.map((g, i) => (
                      <g key={`grid-${i}`}>
                        <line x1="50" y1={g.y} x2="730" y2={g.y} stroke={isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB"} strokeWidth="1" strokeDasharray="4 4" />
                        <text x="40" y={g.y + 3} fill={isDark ? "rgba(225,194,179,0.6)" : "#6B7280"} fontSize="10" fontFamily="helvetica" textAnchor="end">${g.val.toFixed(0)}</text>
                      </g>
                    ))}

                    {/* Area and Line */}
                    <path d={fillPath} fill="url(#growthGradient)"></path>
                    <path d={linePath} fill="none" stroke={isDark ? "#ef4444" : "#5E1914"} strokeWidth="3" strokeLinecap="round"></path>

                    {/* Points and Labels */}
                    {points.map((p, i) => {
                      const isLast = i === points.length - 1;
                      return (
                        <g key={`point-${i}`}>
                          <circle
                            cx={p.x} cy={p.y}
                            r={isLast ? "5" : "3"}
                            fill={isLast ? (isDark ? "#ef4444" : "#5E1914") : (isDark ? "#3A2E29" : "#FFFFFF")}
                            stroke={isDark ? "#ef4444" : "#5E1914"}
                            strokeWidth={isLast ? "0" : "2"}
                          />
                          {isLast && (
                            <g>
                              <rect x={p.x - 30} y={p.y - 32} width="60" height="22" rx="4" fill={isDark ? "#E1C2B3" : "#0B1B2A"} />
                              <path d={`M${p.x - 5},${p.y - 10} L${p.x + 5},${p.y - 10} L${p.x},${p.y - 3} Z`} fill={isDark ? "#E1C2B3" : "#0B1B2A"} />
                              <text x={p.x} y={p.y - 17} fill={isDark ? "#0B1B2A" : "#FFFFFF"} fontSize="11" fontFamily="helvetica" textAnchor="middle" fontWeight="bold">
                                ${p.val.toFixed(0)}
                              </text>
                            </g>
                          )}
                          <text x={p.x} y="240" fill={isDark ? "rgba(225,194,179,0.6)" : "#6B7280"} fontSize="10" fontFamily="helvetica" textAnchor="middle" fontWeight="bold" textTransform="uppercase">
                            {reportData.chartLabels[i]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
