var Api = (function() {
  'use strict';
  var userPayload;
  var watsonPayload;
  var context;

  var messageEndpoint = '/api/message';

  // Publicly accessible methods defined
  return {
    initConversation: initConversation,
    postConversationMessage: postConversationMessage,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getUserPayload: function() {
      return userPayload;
    },
    setUserPayload: function(payload) {
      userPayload = payload;
    },
    getWatsonPayload: function() {
      return watsonPayload;
    },
    setWatsonPayload: function(payload) {
      watsonPayload = payload;
    }
  };

  // Function used for initializing the conversation with the first message from Watson
  function initConversation() {
    postConversationMessage('');
  }

  // Send a message request to the server
  function postConversationMessage(text) {
    var data = {'input': {'text': text}};
    if (context) {
      data.context = context;
    }
    console.log(context);
    Api.setUserPayload(data);
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    http.onload = function() {
      if (http.status === 200 && http.responseText) {
        var response = JSON.parse(http.responseText);
        context = response.context;
        Api.setWatsonPayload(response);
      } else {
        Api.setWatsonPayload({output: {text: [
          'The service may be down at the moment; please check' +
          ' <a href="https://status.ng.bluemix.net/" target="_blank">here</a>' +
          ' for the current status. <br> If the service is OK,' +
          ' the app may not be configured correctly,' +
          ' please check workspace id and credentials for typos. <br>' +
          ' If the service is running and the app is configured correctly,' +
          ' try refreshing the page and/or trying a different request.'
        ]}});
        console.error('Server error when trying to reply!');
      }
    };
    http.onerror = function() {
      console.error('Network error trying to send message!');
    };

    http.send(JSON.stringify(data));
  }
}());