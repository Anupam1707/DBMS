angular.module('supplyChainApp')
  .controller('CarbonReportController', ['$scope', '$location', 'ApiService', function($scope, $location, ApiService) {
    $scope.products = [];
    $scope.selectedProductId = '';
    $scope.report = null;
    $scope.loading = false;
    $scope.errorMessage = '';

    var requestedProductId = Number($location.search().productId || 0);

    var pipelineChart = null;

    function destroyPipelineChart() {
      if (pipelineChart) {
        pipelineChart.destroy();
        pipelineChart = null;
      }
    }

    function formatNumber(value, decimals) {
      var numberValue = Number(value);
      if (!isFinite(numberValue)) {
        numberValue = 0;
      }
      return numberValue.toFixed(decimals || 2);
    }

    function buildPipelineBreakdown(report) {
      if (!report || !report.steps) {
        return { materialLines: [], transportLines: [] };
      }

      var materialLines = (report.steps.materials || []).map(function(row) {
        return formatNumber(row.Quantity_Used) + ' kg x ' +
          formatNumber(row.Emission_Factor) + ' kg CO2/kg = ' +
          formatNumber(row.material_carbon) + ' kg CO2';
      });

      var transportLines = (report.steps.allocations || []).map(function(row) {
        return '(' + formatNumber(row.Quantity_Used) + ' / ' +
          formatNumber(row.total_qty) + ') x ' +
          formatNumber(row.transport_carbon) + ' kg CO2 = ' +
          formatNumber(row.transport_allocated) + ' kg CO2';
      });

      return { materialLines: materialLines, transportLines: transportLines };
    }

    function renderPipelineChart() {
      if (!$scope.report || !$scope.report.totals || typeof Chart === 'undefined') {
        return;
      }

      var ctx = document.getElementById('pipelineChart');
      if (!ctx) {
        return;
      }

      destroyPipelineChart();

      var dataValues = [
        $scope.report.totals.materialTotal || 0,
        $scope.report.totals.transportTotal || 0,
        $scope.report.totals.totalCarbon || 0
      ];

      pipelineChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Materials', 'Transport', 'Total'],
          datasets: [{
            label: 'kg CO2',
            data: dataValues,
            backgroundColor: ['rgba(249,115,22,0.7)', 'rgba(14,165,233,0.7)', 'rgba(34,197,94,0.7)'],
            borderColor: ['rgba(249,115,22,1)', 'rgba(14,165,233,1)', 'rgba(34,197,94,1)'],
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              beginAtZero: true,
              title: { display: true, text: 'kg CO2' },
              grid: { color: 'rgba(0,0,0,0.05)' }
            },
            y: { grid: { display: false } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ' ' + (context.parsed.x || 0).toFixed(2) + ' kg CO2';
                }
              }
            }
          }
        }
      });
    }

    $scope.loadSummary = function() {
      ApiService.getCarbonReportSummary()
        .then(function(response) {
          $scope.products = response.data.products || [];

          if (requestedProductId > 0) {
            var selectedProduct = $scope.products.find(function(product) {
              return Number(product.Product_ID) === requestedProductId;
            });

            if (selectedProduct) {
              $scope.selectedProductId = requestedProductId;
              $scope.loadReport();
            } else {
              $scope.errorMessage = 'The selected product is not available for your account.';
            }
          }
        })
        .catch(function(error) {
          $scope.errorMessage = 'Error loading products: ' + (error.data && error.data.error);
        });
    };

    $scope.loadReport = function() {
      if (!$scope.selectedProductId) {
        $scope.report = null;
        destroyPipelineChart();
        return;
      }

      $scope.loading = true;
      $scope.errorMessage = '';

      ApiService.getCarbonReportDetails($scope.selectedProductId)
        .then(function(response) {
          $scope.report = response.data;
          $scope.report.pipeline = buildPipelineBreakdown($scope.report);
          $scope.loading = false;
          setTimeout(renderPipelineChart, 50);
        })
        .catch(function(error) {
          $scope.errorMessage = 'Error loading report: ' + (error.data && error.data.error);
          $scope.report = null;
          $scope.loading = false;
          destroyPipelineChart();
        });
    };

    $scope.loadSummary();
  }]);
