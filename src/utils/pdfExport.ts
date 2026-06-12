import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ReportData } from './report';
import { formatPrice, getConditionLabel, getRegionLabel } from './format';

const generateReportHTML = (reportData: ReportData): string => {
  const { overview, valueDistribution, rarityAnalysis, platformStats, topValuable, conditionBreakdown } = reportData;

  const getRarityLevel = (condition: string): string => {
    const rarityMap: Record<string, { level: string; color: string }> = {
      '全新': { level: '传说级', color: '#00ff88' },
      '近新': { level: '史诗级', color: '#a855f7' },
      '很好': { level: '稀有级', color: '#06b6d4' },
      '良好': { level: '普通级', color: '#eab308' },
      '一般': { level: '常见级', color: '#f97316' },
      '较差': { level: '破损级', color: '#ef4444' },
    };
    return rarityMap[condition]?.level || condition;
  };

  const getRarityColor = (condition: string): string => {
    const colorMap: Record<string, string> = {
      '全新': '#00ff88',
      '近新': '#a855f7',
      '很好': '#06b6d4',
      '良好': '#eab308',
      '一般': '#f97316',
      '较差': '#ef4444',
    };
    return colorMap[condition] || '#666';
  };

  const maxPlatformValue = Math.max(...platformStats.map(p => p.totalValue), 1);
  const maxValueDistCount = Math.max(...valueDistribution.map(v => v.count), 1);

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
          background: #0a0a0f;
          color: #fff;
          width: 800px;
          padding: 40px;
        }
        .report-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #a855f7;
        }
        .report-title {
          font-size: 32px;
          font-weight: bold;
          color: #a855f7;
          margin-bottom: 8px;
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }
        .report-subtitle {
          font-size: 14px;
          color: #888;
        }
        .section {
          margin-bottom: 36px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #06b6d4;
          margin-bottom: 16px;
          padding-left: 12px;
          border-left: 4px solid #06b6d4;
        }
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        .overview-card {
          background: #1a1a2e;
          border: 1px solid #2a2a4a;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }
        .overview-card .label {
          font-size: 12px;
          color: #888;
          margin-bottom: 6px;
        }
        .overview-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
        }
        .overview-card.cyan .value { color: #06b6d4; }
        .overview-card.green .value { color: #00ff88; }
        .overview-card.purple .value { color: #a855f7; }
        .overview-card.amber .value { color: #eab308; }
        
        .highlight-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .highlight-card {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid #2a2a4a;
          border-radius: 8px;
          padding: 16px;
        }
        .highlight-card .label {
          font-size: 12px;
          color: #a855f7;
          margin-bottom: 8px;
        }
        .highlight-card .title {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          margin-bottom: 4px;
        }
        .highlight-card .detail {
          font-size: 12px;
          color: #888;
        }
        .highlight-card .price {
          font-size: 20px;
          font-weight: bold;
          color: #eab308;
          margin-top: 8px;
        }

        .chart-container {
          background: #1a1a2e;
          border: 1px solid #2a2a4a;
          border-radius: 8px;
          padding: 20px;
        }
        .bar-chart {
          display: flex;
          align-items: flex-end;
          height: 200px;
          gap: 12px;
          padding: 10px 0;
        }
        .bar-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }
        .bar {
          width: 100%;
          background: linear-gradient(to top, #06b6d4, #00ff88);
          border-radius: 4px 4px 0 0;
          transition: height 0.3s;
          min-height: 4px;
        }
        .bar-label {
          font-size: 10px;
          color: #888;
          margin-top: 8px;
          text-align: center;
          white-space: nowrap;
        }
        .bar-value {
          font-size: 11px;
          color: #06b6d4;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .rarity-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .rarity-card {
          background: #1a1a2e;
          border: 1px solid #2a2a4a;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }
        .rarity-level {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .rarity-count {
          font-size: 28px;
          font-weight: bold;
          color: #fff;
          margin-bottom: 4px;
        }
        .rarity-percent {
          font-size: 12px;
          color: #888;
        }
        .rarity-avg {
          font-size: 11px;
          color: #666;
          margin-top: 6px;
        }

        .platform-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .platform-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .platform-name {
          width: 60px;
          font-size: 13px;
          color: #fff;
          font-weight: bold;
        }
        .platform-bar-container {
          flex: 1;
          height: 24px;
          background: #1a1a2e;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .platform-bar {
          height: 100%;
          background: linear-gradient(to right, #a855f7, #06b6d4);
          border-radius: 4px;
        }
        .platform-stats {
          width: 120px;
          text-align: right;
          font-size: 12px;
        }
        .platform-stats .count {
          color: #888;
        }
        .platform-stats .value {
          color: #eab308;
          font-weight: bold;
        }

        .top-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .top-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1a1a2e;
          border: 1px solid #2a2a4a;
          border-radius: 6px;
          padding: 10px 14px;
        }
        .top-rank {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #a855f7;
          color: #fff;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .top-rank.gold { background: linear-gradient(135deg, #ffd700, #ff8c00); }
        .top-rank.silver { background: linear-gradient(135deg, #c0c0c0, #808080); }
        .top-rank.bronze { background: linear-gradient(135deg, #cd7f32, #8b4513); }
        .top-info {
          flex: 1;
        }
        .top-title {
          font-size: 13px;
          font-weight: bold;
          color: #fff;
          margin-bottom: 2px;
        }
        .top-detail {
          font-size: 11px;
          color: #888;
        }
        .top-price {
          font-size: 14px;
          font-weight: bold;
          color: #eab308;
        }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #2a2a4a;
          text-align: center;
          font-size: 11px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <div class="report-title">🎮 藏品估值报告</div>
        <div class="report-subtitle">生成日期：${overview.reportDate}</div>
      </div>

      <div class="section">
        <div class="section-title">📊 收藏总览</div>
        <div class="overview-grid">
          <div class="overview-card cyan">
            <div class="label">藏品总数</div>
            <div class="value">${overview.totalCartridges}</div>
          </div>
          <div class="overview-card green">
            <div class="label">总估值</div>
            <div class="value">${formatPrice(overview.totalValue)}</div>
          </div>
          <div class="overview-card purple">
            <div class="label">平均单价</div>
            <div class="value">${formatPrice(Math.round(overview.avgValue))}</div>
          </div>
          <div class="overview-card amber">
            <div class="label">平台数量</div>
            <div class="value">${overview.totalPlatforms}</div>
          </div>
        </div>
        <div class="highlight-section">
          <div class="highlight-card">
            <div class="label">🏆 最具价值藏品</div>
            ${overview.mostValuable ? `
              <div class="title">${overview.mostValuable.title}</div>
              <div class="detail">${overview.mostValuable.platform} · ${getConditionLabel(overview.mostValuable.condition)} · ${getRegionLabel(overview.mostValuable.region)}</div>
              <div class="price">${formatPrice(overview.mostValuable.purchasePrice)}</div>
            ` : '<div class="detail">暂无数据</div>'}
          </div>
          <div class="highlight-card">
            <div class="label">📦 箱说全比例</div>
            <div class="title">${overview.completeInBox} / ${overview.totalCartridges}</div>
            <div class="detail">占总藏品的 ${overview.completeInBoxPercentage.toFixed(1)}%</div>
            <div class="price" style="font-size: 24px;">${overview.completeInBoxPercentage.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">💰 价值分布</div>
        <div class="chart-container">
          <div class="bar-chart">
            ${valueDistribution.map(item => `
              <div class="bar-item">
                <div class="bar-value">${item.count > 0 ? item.count + '件' : ''}</div>
                <div class="bar" style="height: ${item.count > 0 ? Math.max((item.count / maxValueDistCount) * 100, 5) : 0}%;"></div>
                <div class="bar-label">${item.range}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">💎 稀有度分析</div>
        <div class="rarity-grid">
          ${rarityAnalysis.filter(r => r.count > 0).map(item => `
            <div class="rarity-card">
              <div class="rarity-level" style="color: ${getRarityColor(item.condition)};">
                ${getRarityLevel(item.condition)}
              </div>
              <div class="rarity-count" style="color: ${getRarityColor(item.condition)};">
                ${item.count}
              </div>
              <div class="rarity-percent">${item.percentage.toFixed(1)}% · ${item.condition}</div>
              <div class="rarity-avg">均价 ${formatPrice(Math.round(item.avgValue))}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">🎯 平台价值排行</div>
        <div class="chart-container">
          <div class="platform-list">
            ${platformStats.slice(0, 5).map(p => `
              <div class="platform-item">
                <div class="platform-name">${p.platform}</div>
                <div class="platform-bar-container">
                  <div class="platform-bar" style="width: ${(p.totalValue / maxPlatformValue) * 100}%;"></div>
                </div>
                <div class="platform-stats">
                  <span class="count">${p.count}件</span> · 
                  <span class="value">${formatPrice(p.totalValue)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">⭐ TOP 5 最具价值藏品</div>
        <div class="top-list">
          ${topValuable.map((item, index) => `
            <div class="top-item">
              <div class="top-rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">
                ${index + 1}
              </div>
              <div class="top-info">
                <div class="top-title">${item.title}</div>
                <div class="top-detail">${item.platform} · ${getConditionLabel(item.condition)} · ${item.releaseYear}年</div>
              </div>
              <div class="top-price">${formatPrice(item.purchasePrice)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="footer">
        本报告由复古卡带收藏管理系统自动生成 · ${overview.reportDate}
      </div>
    </body>
    </html>
  `;
};

export const exportReportPDF = async (reportData: ReportData): Promise<void> => {
  const html = generateReportHTML(reportData);

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.zIndex = '-1';
  document.body.appendChild(container);

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const styleEl = doc.querySelector('style');
  const bodyContent = doc.body.innerHTML;

  if (styleEl) {
    container.appendChild(styleEl);
  }

  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = bodyContent;
  container.appendChild(contentDiv);

  try {
    const reportElement = contentDiv;

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0a0a0f',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `藏品估值报告_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
};
