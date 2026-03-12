angular.module('supplyChainApp')
    .controller('DashboardController', ['$scope', '$rootScope', 'ApiService', 
        function($scope, $rootScope, ApiService) {
        
        $scope.stats = {};
        $scope.recentTransports = [];
        $scope.transportDistribution = [];
        $scope.topSuppliers = [];
        $scope.highEmissionMaterials = [];
        $scope.maxEmission = 0;
        $scope.currentUser = $rootScope.currentUser || {};
        
        // Load dashboard data
        $scope.loadDashboard = function() {
            // Get statistics
            ApiService.getDashboardStats().then(function(response) {
                $scope.stats = response.data;
            });
            
            // Get recent transports
            ApiService.getRecentTransports().then(function(response) {
                $scope.recentTransports = response.data;
            });
            
            // Get transport distribution
            ApiService.getTransportDistribution().then(function(response) {
                $scope.transportDistribution = response.data;
            });
            
            // Get top suppliers
            ApiService.getTopSuppliers().then(function(response) {
                $scope.topSuppliers = response.data;
            });
            
            // Get high emission materials
            ApiService.getHighEmissionMaterials().then(function(response) {
                $scope.highEmissionMaterials = response.data;
                if (response.data.length > 0) {
                    $scope.maxEmission = Math.max(...response.data.map(m => m.Emission_Factor));
                }
            });
        };
        
        $scope.getModeIcon = function(mode) {
            const icons = {
                'Air': '✈️',
                'Ship': '🚢',
                'Truck': '🚛',
                'Rail': '🚂'
            };
            return icons[mode] || '🚚';
        };
        
        // Initialize charts after data loads
        $scope.initCharts = function() {
            // Wait for data to load
            setTimeout(function() {
                // Transport Mode Pie Chart
                if ($scope.transportDistribution.length > 0) {
                    const ctx1 = document.getElementById('transportPieChart');
                    if (ctx1) {
                        new Chart(ctx1, {
                            type: 'pie',
                            data: {
                                labels: $scope.transportDistribution.map(t => t.Transport_Mode),
                                datasets: [{
                                    data: $scope.transportDistribution.map(t => t.count),
                                    backgroundColor: [
                                        '#ff6b35',
                                        '#f7931e',
                                        '#ffb84d',
                                        '#1a1a1a',
                                        '#333333'
                                    ],
                                    borderWidth: 2,
                                    borderColor: '#fff'
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            padding: 15,
                                            font: { size: 12 }
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return context.label + ': ' + context.parsed + ' shipments';
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
                    const ctx2 = document.getElementById('emissionsBarChart');
                    if (ctx2) {
                        new Chart(ctx2, {
                            type: 'bar',
                            data: {
                                labels: $scope.highEmissionMaterials.map(m => m.Material_Name),
                                datasets: [{
                                    label: 'Emission Factor (kg CO2/kg)',
                                    data: $scope.highEmissionMaterials.map(m => m.Emission_Factor),
                                    backgroundColor: 'rgba(255, 107, 53, 0.8)',
                                    borderColor: 'rgba(255, 107, 53, 1)',
                                    borderWidth: 2
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'kg CO2/kg'
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }
                        });
                    }
                }
                
                // Suppliers Chart
                if ($scope.topSuppliers.length > 0) {
                    const ctx3 = document.getElementById('suppliersChart');
                    if (ctx3) {
                        new Chart(ctx3, {
                            type: 'bar',
                            data: {
                                labels: $scope.topSuppliers.map(s => s.Supplier_Name),
                                datasets: [{
                                    label: 'Shipments',
                                    data: $scope.topSuppliers.map(s => s.shipment_count),
                                    backgroundColor: 'rgba(255, 107, 53, 0.8)',
                                    borderColor: 'rgba(255, 107, 53, 1)',
                                    borderWidth: 2,
                                    yAxisID: 'y'
                                }, {
                                    label: 'Total Weight (kg)',
                                    data: $scope.topSuppliers.map(s => s.total_weight),
                                    backgroundColor: 'rgba(26, 26, 26, 0.8)',
                                    borderColor: 'rgba(26, 26, 26, 1)',
                                    borderWidth: 2,
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
                                        title: {
                                            display: true,
                                            text: 'Number of Shipments'
                                        }
                                    },
                                    y1: {
                                        type: 'linear',
                                        display: true,
                                        position: 'right',
                                        title: {
                                            display: true,
                                            text: 'Weight (kg)'
                                        },
                                        grid: {
                                            drawOnChartArea: false
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }, 500);
        };
        
        $scope.loadDashboard();
        $scope.initCharts();
    }]);
