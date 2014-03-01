var InitInventoryCtrl = function($scope, $http, $q, $location, UserService) {
  $scope.gpsStatus = 'Provide GPS';
  $scope.gpsDisable = false;
  $scope.home = false;

  $scope.defaultItems = [
  	{ item: 'Salt', id: 443 },
    { item: 'Milk (Any)', id: 247 },
    { item: 'Egg (Whole)', id: 338 },
    { item: 'Butter (Unsalted)', id: 186 },
    { item: 'Pepper (Black)', id: 444 },
    { item: 'Flour (All-Purpose)', id: 255 },
    { item: 'Rice (Brown)', id: 266 }
  ];
  $scope.selectedItems = {
    443: true,
    247: true,
    338: true,
    186: true,
    444: true,
    255: true,
    266: true
  };

  UserService.
    getCurrentUser().
    success(function(user) { 
      $scope.user = user; 
      $scope.userField.email = user.email;
    }).
    error(function() { $scope.user = {}; });
  $scope.userField = {
    email: '',
    location: '94305',
    gps: ''
  };

  $scope.toggleItem = function(itemID) {
    $scope.selectedItems[itemID] = !$scope.selectedItems[itemID];
  };

  $scope.initUser = function() {
    if ($scope.initForm.$invalid) return;

    var itemIDs = [];
    _.each($scope.selectedItems, function(val, key) {
      if (val) itemIDs.push(key);
    });
    // TODO: use $scope.home to decide whether to include $scope.userField.gps in the PUT request
    $q.all({
      user: $http.put('/profile/me', $scope.userField),
      inventory: $http.put('/inventory', { inventory: itemIDs })
    }).then(function() {
      $location.path('/profile/' + $scope.user.id);
    });
  };

  // TODO create geolocation service
  var getLocation = function() {
    if (navigator.geolocation) {
      $scope.gpsStatus = "Fetching GPS...";
      navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  $scope.$on('$viewContentLoaded', getLocation);

  var showPosition = function(position) {
    // TODO: do reverse lookup of lat/long to zipcode so this is human understandable
    $scope.userField.gps = position.coords.latitude + "," + position.coords.longitude;
    console.log($scope.userField.gps);
    $scope.gpsStatus = "Found GPS, thanks!";
    $scope.gpsDisable = true;
    $scope.$apply();
  };

  var handleError = function(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
      }
  };
};

InitInventoryCtrl.$inject = ['$scope', '$http', '$q', '$location', 'UserService'];