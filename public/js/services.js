angular.module('ncook.services', ['ng'])
  .factory('TypeaheadService', ['$http', function($http) {
    return {
      items: function(query) {
        var success = function(result) {
          return result.data;
        };

        // return a promise object for typeahead
        return $http.get('/search/typeahead?query=' + query).then(success);
      }
    }
  }]);