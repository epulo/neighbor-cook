var EditProfileCtrl = function($scope, $http, $location, UserService) {
  $scope.gpsStatus = 'Provide GPS';
  $scope.gpsDisable = false;
  $scope.home = false;

  UserService.getCurrentUser().success(function(user) {
    $scope.user = user;
    $scope.userField = {
      email: user.email,
      location: user.location,
      gps: user.gps
    };
  });

  $scope.edit = function() {
    $http.put('/profile/me', $scope.userField).success(function() {
      $location.path('/profile/' + $scope.user.id);
    })
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

EditProfileCtrl.$inject = ['$scope', '$http', '$location', 'UserService'];