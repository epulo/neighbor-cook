window.fbAsyncInit = function() {
  FB.init({
    appId      : '1457400784472890',
    status     : true, // check login status
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true   // parse XFBML
  });

  // authResponse: {
  //     accessToken: '...',
  //     expiresIn:'...',
  //     signedRequest:'...',
  //     userID:'...'
  // }
  $('#sign_in').click(function(event) {
    event.preventDefault();
    FB.login(function(response) {
      // equivalent to response.status === 'connected'?
      if (response.authResponse) { 
        console.log(response.authResponse);
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;
        // might want to trigger this remotely using AJAX to stay on same page
        // window.location = '/auth/facebook/callback';
        $.post( "/auth/facebook/callback", { authResponse: response.authResponse} );
        
      }
    });
  });

  $('#sign_out').click(function(event) {
    FB.getLoginStatus(function(response) {
      if (response.authResponse) {
        FB.logout();
      }
     });
    return true;
  });
};

// Load the SDK asynchronously
(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
}(document));