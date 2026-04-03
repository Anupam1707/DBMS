angular.module('supplyChainApp')
    .controller('DashboardController', ['$scope', '$rootScope', '$q', 'ApiService',
        function($scope, $rootScope, $q, ApiService) {

        $scope.stats = {};
        $scope.recentTransports = [];
        $scope.transportDistribution = [];
        $scope.topSuppliers = [];
        $scope.highEmissionMaterials = [];
        $scope.maxEmission = 0;
        $scope.loading = true;
        $scope.currentUser = $rootScope.currentUser || {};

        var chartInstances = {};

        function destroyChart(id) {
            if (chartInstances[id]) {
                chartInstances[id].destroy();
                delete chartInstances[id];
            }
        }

        $scope.getModeIcon = function(mode) {
            var icons = {
                'Air': '✈️',
                'Ship': '🚢',
                'Truck': '🚛',
                'Rail': '🚂'
            };
            return icons[mode] || '🚚';
        };

        function initCharts() {
            // Transport Mode Pie Chart
            if ($scope.transportDistribution.length > 0) {
                var ctx1 = document.getElementById('transportPieChart');
                if (ctx1) {
                    destroyChart('transportPieChart');
                    chartInstances['transportPieChart'] = new Chart(ctx1, {
                        type: 'doughnut',
                        data: {
                            labels: $scope.transportDistribution.map(function(t) { return t.Transport_Mode; }),
                            datasets: [{
                                data: $scope.transportDistribution.map(function(t) { return t.count; }),
                                backgroundColor: ['#f97316', '#0ea5e9', '#8b5cf6', '#22c55e', '#f43f5e'],
                                borderWidth: 3,
                                borderColor: '#ffffff',
                                hoverOffset: 8
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            cutout: '60%',
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 20,
                                        font: { size: 13, family: "'Plus Jakarta Sans', sans-serif" },
                                        usePointStyle: true,
                                        pointStyleWidth: 10
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            return ' ' + context.label + ': ' + context.parsed + ' shipments';
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }

            // Emissions Bar Chart
            if ($scope.highEmissionMaterials.length > 0) {
                var ctx2 = document.getElementById('emissionsBarChart');
                if (ctx2) {
                    destroyChart('emissionsBarChart');
                    chartInstances['emissionsBarChart'] = new Chart(ctx2, {
                        type: 'bar',
                        data: {
                            labels: $scope.highEmissionMaterials.map(function(m) { return m.Material_Name; }),
                            datasets: [{
                                label: 'Emission Factor (kg CO₂/kg)',
                                data: $scope.highEmissionMaterials.map(function(m) { return m.Emission_Factor; }),
                                backgroundColor: [
                                    'rgba(249,115,22,0.85)',
                                    'rgba(249,115,22,0.70)',
                                    'rgba(249,115,22,0.55)',
                                    'rgba(249,115,22,0.40)',
                                    'rgba(249,115,22,0.25)'
                                ],
                                borderColor: 'rgba(249,115,22,1)',
                                borderWidth: 2,
                                borderRadius: 6
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: { display: true, text: 'kg CO₂/kg' },
                                    grid: { color: 'rgba(0,0,0,0.05)' }
                                },
                                x: { grid: { display: false } }
                            },
                            plugins: {
                                legend: { display: false }
                            }
                        }
                    });
                }
            }

            // Suppliers Chart
            if ($scope.topSuppliers.length > 0) {
                var ctx3 = document.getElementById('suppliersChart');
                if (ctx3) {
                    destroyChart('suppliersChart');
                    chartInstances['suppliersChart'] = new Chart(ctx3, {
                        type: 'bar',
                        data: {
                            labels: $scope.topSuppliers.map(function(s) { return s.Supplier_Name; }),
                            datasets: [{
                                label: 'Shipments',
                                data: $scope.topSuppliers.map(function(s) { return s.shipment_count; }),
                                backgroundColor: 'rgba(249,115,22,0.85)',
                                borderColor: 'rgba(249,115,22,1)',
                                borderWidth: 2,
                                borderRadius: 6,
                                yAxisID: 'y'
                            }, {
                                label: 'Total Weight (kg)',
                                data: $scope.topSuppliers.map(function(s) { return s.total_weight; }),
                                backgroundColor: 'rgba(15,23,42,0.75)',
                                borderColor: 'rgba(15,23,42,1)',
                                borderWidth: 2,
                                borderRadius: 6,
                                yAxisID: 'y1'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                    title: { display: true, text: 'Shipments' },
                                    grid: { color: 'rgba(0,0,0,0.05)' }
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    title: { display: true, text: 'Weight (kg)' },
                                    grid: { drawOnChartArea: false }
                                },
                                x: { grid: { display: false } }
                            },
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        usePointStyle: true,
                                        font: { family: "'Plus Jakarta Sans', sans-serif" }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }

        // Load all dashboard data in parallel, then init charts
        $scope.loadDashboard = function() {
            $scope.loading = true;

            $q.all([
                ApiService.getDashboardStats(),
                ApiService.getRecentTransports(),
                ApiService.getTransportDistribution(),
                ApiService.getTopSuppliers(),
                ApiService.getHighEmissionMaterials()
            ]).then(function(results) {
                $scope.stats              = results[0].data;
                $scope.recentTransports   = results[1].data;
                $scope.transportDistribution = results[2].data;
                $scope.topSuppliers       = results[3].data;
                $scope.highEmissionMaterials = results[4].data;

                if ($scope.highEmissionMaterials.length > 0) {
                    $scope.maxEmission = Math.max.apply(null,
                        $scope.highEmissionMaterials.map(function(m) { return m.Emission_Factor; })
                    );
                }

                $scope.loading = false;

                // Initialize charts after DOM settles
                setTimeout(initCharts, 100);
            }).catch(function() {
                $scope.loading = false;
            });
        };

        $scope.loadDashboard();
    }]);
