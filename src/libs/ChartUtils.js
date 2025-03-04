/**
 * ChartUtils.js
 * Utility functions for creating and managing distribution charts
 */

class ChartUtils {
  /**
   * Create a pie chart for distribution visualization
   * @param {Object} chartData - Data for the chart
   * @param {Array<number>} chartData.shares - Array of share values
   * @param {Array<string>} chartData.labels - Array of labels for each share
   * @param {Array<string>} chartData.colors - Array of colors for each share
   * @param {number} chartData.totalValue - Total value of the estate
   * @param {HTMLElement} container - Container element to render the chart in
   * @returns {Object} - Chart instance
   */
  static createDistributionChart(chartData, container) {
    // Create a canvas element for the chart
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    canvas.className = 'intestacy-chart';
    container.appendChild(canvas);
    
    // Format currency for tooltips
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
      }).format(value);
    };
    
    // Calculate percentages
    const percentages = chartData.shares.map(share => 
      (share / chartData.totalValue * 100).toFixed(1)
    );
    
    // Create label with percentage
    const labelsWithPercentage = chartData.labels.map((label, i) => 
      `${label} (${percentages[i]}%)`
    );
    
    // Setup chart configuration
    const config = {
      type: 'pie',
      data: {
        labels: labelsWithPercentage,
        datasets: [{
          data: chartData.shares,
          backgroundColor: chartData.colors,
          borderWidth: 1,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 12
              },
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return ` ${label}: ${formatCurrency(value)}`;
              }
            }
          }
        }
      }
    };
    
    try {
      // Create and return the chart
      return new Chart(canvas.getContext('2d'), config);
    } catch (error) {
      console.error('Error creating chart:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'intestacy-chart-error';
      errorMessage.textContent = 'Unable to display distribution chart';
      container.appendChild(errorMessage);
      return null;
    }
  }
  
  /**
   * Create a breakdown bar chart for more detailed visualization
   * @param {Object} chartData - Data for the chart
   * @param {Array<number>} chartData.shares - Array of share values
   * @param {Array<string>} chartData.labels - Array of labels for each share
   * @param {Array<string>} chartData.colors - Array of colors for each share
   * @param {number} chartData.totalValue - Total value of the estate
   * @param {HTMLElement} container - Container element to render the chart in
   * @returns {Object} - Chart instance
   */
  static createBreakdownChart(chartData, container) {
    // Only create breakdown if there are multiple shares
    if (chartData.shares.length <= 1) {
      return null;
    }
    
    // Create a canvas element for the chart
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    canvas.className = 'intestacy-chart';
    container.appendChild(canvas);
    
    // Format currency for tooltips
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
      }).format(value);
    };
    
    // Setup chart configuration
    const config = {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [{
          data: chartData.shares,
          backgroundColor: chartData.colors,
          borderWidth: 1,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw || 0;
                return `${formatCurrency(value)}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: function(value) {
                return formatCurrency(value);
              }
            }
          }
        }
      }
    };
    
    try {
      // Create and return the chart
      return new Chart(canvas.getContext('2d'), config);
    } catch (error) {
      console.error('Error creating breakdown chart:', error);
      return null;
    }
  }
}

export default ChartUtils; 