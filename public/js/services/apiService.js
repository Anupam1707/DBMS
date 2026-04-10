angular.module('supplyChainApp')
  .factory('ApiService', ['$http', function($http) {
    const baseUrl = '/api';

    return {
      // Auth services
      login: function(credentials) {
        return $http.post(baseUrl + '/auth/login', credentials, { withCredentials: true });
      },
      register: function(userData) {
        return $http.post(baseUrl + '/auth/register', userData, { withCredentials: true });
      },
      logout: function() {
        return $http.post(baseUrl + '/auth/logout', {}, { withCredentials: true });
      },
      checkAuth: function() {
        return $http.get(baseUrl + '/auth/check', { withCredentials: true });
      },
      
      updateProfile: function(profileData) {
        return $http.put(baseUrl + '/auth/profile', profileData, { withCredentials: true });
      },
      
      changePassword: function(passwordData) {
        return $http.put(baseUrl + '/auth/password', passwordData, { withCredentials: true });
      },
      
      // Dashboard services
      getDashboardStats: function() {
        return $http.get(baseUrl + '/dashboard/stats', { withCredentials: true });
      },
      getRecentTransports: function() {
        return $http.get(baseUrl + '/dashboard/recent-transports', { withCredentials: true });
      },
      getTransportDistribution: function() {
        return $http.get(baseUrl + '/dashboard/transport-distribution', { withCredentials: true });
      },
      getTopSuppliers: function() {
        return $http.get(baseUrl + '/dashboard/top-suppliers', { withCredentials: true });
      },
      getHighEmissionMaterials: function() {
        return $http.get(baseUrl + '/dashboard/high-emission-materials', { withCredentials: true });
      },

      // Suppliers
      getSuppliers: function() {
        return $http.get(baseUrl + '/suppliers', { withCredentials: true });
      },
      getSupplier: function(id) {
        return $http.get(baseUrl + '/suppliers/' + id, { withCredentials: true });
      },
      createSupplier: function(supplier) {
        return $http.post(baseUrl + '/suppliers', supplier, { withCredentials: true });
      },
      updateSupplier: function(id, supplier) {
        return $http.put(baseUrl + '/suppliers/' + id, supplier, { withCredentials: true });
      },
      deleteSupplier: function(id) {
        return $http.delete(baseUrl + '/suppliers/' + id, { withCredentials: true });
      },

      // Materials
      getMaterials: function() {
        return $http.get(baseUrl + '/materials', { withCredentials: true });
      },
      getMaterial: function(id) {
        return $http.get(baseUrl + '/materials/' + id, { withCredentials: true });
      },
      createMaterial: function(material) {
        return $http.post(baseUrl + '/materials', material, { withCredentials: true });
      },
      updateMaterial: function(id, material) {
        return $http.put(baseUrl + '/materials/' + id, material, { withCredentials: true });
      },
      deleteMaterial: function(id) {
        return $http.delete(baseUrl + '/materials/' + id, { withCredentials: true });
      },

      // Products
      getProducts: function() {
        return $http.get(baseUrl + '/products', { withCredentials: true });
      },
      getProduct: function(id) {
        return $http.get(baseUrl + '/products/' + id, { withCredentials: true });
      },
      createProduct: function(product) {
        return $http.post(baseUrl + '/products', product, { withCredentials: true });
      },
      updateProduct: function(id, product) {
        return $http.put(baseUrl + '/products/' + id, product, { withCredentials: true });
      },
      deleteProduct: function(id) {
        return $http.delete(baseUrl + '/products/' + id, { withCredentials: true });
      },

      // Transport Logs
      getTransportLogs: function() {
        return $http.get(baseUrl + '/transport-logs', { withCredentials: true });
      },
      getTransportLog: function(id) {
        return $http.get(baseUrl + '/transport-logs/' + id, { withCredentials: true });
      },
      createTransportLog: function(log) {
        return $http.post(baseUrl + '/transport-logs', log, { withCredentials: true });
      },
      updateTransportLog: function(id, log) {
        return $http.put(baseUrl + '/transport-logs/' + id, log, { withCredentials: true });
      },
      deleteTransportLog: function(id) {
        return $http.delete(baseUrl + '/transport-logs/' + id, { withCredentials: true });
      },

      // Product Composition
      getProductCompositions: function() {
        return $http.get(baseUrl + '/product-composition', { withCredentials: true });
      },
      getProductComposition: function(id) {
        return $http.get(baseUrl + '/product-composition/' + id, { withCredentials: true });
      },
      createProductComposition: function(composition) {
        return $http.post(baseUrl + '/product-composition', composition, { withCredentials: true });
      },
      updateProductComposition: function(id, composition) {
        return $http.put(baseUrl + '/product-composition/' + id, composition, { withCredentials: true });
      },
      deleteProductComposition: function(id) {
        return $http.delete(baseUrl + '/product-composition/' + id, { withCredentials: true });
      },
      // Carbon Report
      getCarbonReportSummary: function() {
        return $http.get(baseUrl + '/carbon-report/products', { withCredentials: true });
      },
      getCarbonReportDetails: function(productId) {
        return $http.get(baseUrl + '/carbon-report/products/' + productId, { withCredentials: true });
      }
    };
  }]);
