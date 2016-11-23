(function() {

bindSendButtonEvent();
init();

}());
 function init(){
  Api.initConversation();
  Api.setWatsonPayload = appendWastonToWindow;
 }
//bindSendButtonEvent
function bindSendButtonEvent(){
  muted = false;
  $("#btn-input").keypress(function(event) {
    if (event.keyCode === 13) {
      sendMessage();
      event.preventDefault();
      $("#btn-input").val('');
    }
  });
  $("#btn-chat").on("click",function(event){
    sendMessage();
     event.preventDefault();
    $("#btn-input").val('');
  });
   $("#SoundButton").on("click",function(){
    if(muted) {
      $(this).html('<span class="glyphicon glyphicon-volume-off"></span>muted');
      muted = false;
    }
    else {
      $(this).html('<span class="glyphicon glyphicon-volume-up"></span>sound');
      muted = true;
    }
   });
}
//send message
function sendMessage(newText) {
  var text;
  if (newText) {
    text = newText;
  } else {
    text = $("#btn-input").val();
  }
  if (!text) {
    return;
  }
  appendMessageToWindow(text);
  Api.postConversationMessage(text);
}

function appendMessageToWindow(text){
  var msg = '<li class="right clearfix"><span class="chat-img pull-right">\
                    <img src="http://placehold.it/50/FA6F57/fff&amp;text=ME" alt="User Avatar" class="img-circle">\
                  </span>\
                  <div class="chat-body clearfix">\
                    <div class="header">\
                      <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>' + getNow() + '</small>\
                      <strong class="pull-right primary-font">Patients</strong>\
                    </div>\
                    <p>' + text + '</p>\
                  </div>\
                </li>';
  $("#chat-window").append(msg);
  $("#panel-body").animate({scrollTop:$("#panel-body").prop('scrollHeight')}, 'slow');
}

function appendWastonToWindow(data){
  var text = extractText(data);
  if(!muted)
    TTSModule.playCurrentAudio(text);
  var msg = '<li class="left clearfix">\
              <span class="chat-img pull-left">\
              <img src="http://placehold.it/50/55C1E7/fff&amp;text=Dr." alt="User Avatar" class="img-circle">\
              </span>\
              <div class="chat-body clearfix">\
                <div class="header">\
                  <strong class="primary-font">Doctor A.</strong> <small class="pull-right text-muted">\
                  <span class="glyphicon glyphicon-time"></span>' + getNow() + '</small>\
                </div>\
                <p>' + text + ' </p>\
              </div>\
            </li>';
  $("#chat-window").append(msg);
  $("#panel-body").animate({scrollTop:$("#panel-body").prop('scrollHeight')}, 'slow');
}

function extractText(data){
  var pureText = "";
  var outputText =  data.output.text;
  $.each(outputText,function(indexInArray,value){
    pureText += value;
  });
  return pureText;
}
function getNow(){
  var dt = new Date();
  var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  return time;
}