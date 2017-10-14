MqttClient = function(messageCallback) {
  // Random client name each time.
  var clientName = 'hass-mqtt-dash-' + Math.floor(Math.random() * 100000000);
  this.client = new Paho.MQTT.Client(
    config.mqttHost,
    config.mqttPort,
    clientName);
  this.client.onMessageArrived = messageCallback;
  this.connect();
};


MqttClient.prototype.onConnect = function() {
  config.keys.forEach(
      (key) => this.client.subscribe(config.mqttTopicPrefix + key));
};


MqttClient.prototype.connect = function() {
  this.client.connect({
    userName: config.mqttUsername,
    password: config.mqttPassword,
    useSSL: config.mqttSsl,
    onSuccess: this.onConnect.bind(this),
  });
};


DashController = function($interval) {
  this.data = {};
  this.mqttClient = new MqttClient(this.onMqttMessage.bind(this));

  // Reconnect automatically.
  $interval(() => {
    if (!this.mqttClient.client.isConnected()) {
      this.mqttClient.connect();
    }
  }, 3000);
};


DashController.prototype.onMqttMessage = function(message) {
  var entry = JSON.parse(message._getPayloadString())
  this.data[entry.entity_id] = entry;
};


var dashApp = angular.module('dashApp', []);
dashApp.controller('DashController', DashController);

dashApp.filter('toArray', () => (obj) => Object.values(obj));
