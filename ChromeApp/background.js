chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 1024,
      'height': 600
    }
  });

});

chrome.extension.isAllowedIncognitoAccess(function(isAllowedAccess) {
  if (isAllowedAccess) return; // Great, we've got access

  // alert for a quick demonstration, please create your own user-friendly UI
  alert('Please allow incognito mode in the following screen.');

  chrome.tabs.create({
      url: 'chrome://extensions/?id=' + chrome.runtime.id
  });
});