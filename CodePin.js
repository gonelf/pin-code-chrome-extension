var tablink
var uploadedImage
chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){
//      alert(tabs[0].url);
//    console.log(tabs[0].url);
      tablink = tabs[0].url;
    loadImage();
   }
);

function loaded (data) {
//  $("#theimage").append('<img src="http://api.grabz.it/services/getjspicture.ashx?id='+data+'" />');
}

function loadImage() {
  
  console.log("tablink:"+tablink);
  $("#theimage").append('<img id="image" data-url="'+tablink+'" />');
  requestImage(tablink);
}

function requestImage (url) {
  $("#status").html("Fetching image");
  $.ajax({
      url: 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=' + url + '&screenshot=true',
      context: this,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        data = data.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
//          $("#image").attr('src', 'data:image/jpeg;base64,' + data);
        
        var postData = {image:data}
        $("#status").html("Uploading image to imgur");
        $.ajax({
          type: "POST",
          url: "https://api.imgur.com/3/image",
          data: postData,
          headers: {"Authorization": "Client-ID f7708d42f67c828"},
          success: function (response) {
            
            // add the uploaded image link to the screen
            console.log(response.data.link);
            $("#image").attr('src', response.data.link);
            uploadedImage = response.data.link
            // add pinterest button with link and image 
//            $("thebutton").html('<a href="https://www.pinterest.com/pin/create/button/?url='+tablink+'&media='+uploadedImage+'&description=Code page"data-pin-do="buttonPin"data-pin-config="above"><img src="//assets.pinterest.com/images/pidgets/pin_it_button.png" /></a>');
            openWindow();
          }
        });
      }
  });
}

function openWindow () {
  var link = 'https://www.pinterest.com/pin/create/button/';
          link += '?url='+tablink;
          link += '&media='+uploadedImage;
          link += '&description=something';
  
  console.log(link);
  var w = 700,
  h = 400;
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  var imgPinWindow = window.open(link,'imgPngWindow', 'toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=700, height=400');
  imgPinWindow.moveTo(left, top);
  return false; 
}

///////////////////////////////////////////////////////////////////