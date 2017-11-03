/** Maintains a connection to the MQTT stream and reconnects automatically. */
class HassMqttService {
  constructor($interval, hassMqttConfig) {
    this.config = hassMqttConfig;
    this.data = {};
    this.callbacks = [];

    // Random client name each time.
    const clientName =
        'hass-mqtt-dash-' + Math.floor(Math.random() * 100000000);
    this.client = new Paho.MQTT.Client(
        hassMqttConfig.mqttHost,
        hassMqttConfig.mqttPort,
        clientName);
    this.client.onMessageArrived = this.onMqttMessage.bind(this);
    this.connect();

    // Reconnect automatically.
    $interval(() => {
      if (!this.client.isConnected()) {
        this.connect();
      }
    }, 3000);
  }

  registerCallback(callback) {
    this.callbacks.push(callback);
  }

  onMqttMessage(message) {
    const entry = JSON.parse(message._getPayloadString())
    this.data[entry.entity_id] = entry;
    this.callbacks.forEach((cb) => cb(this.data));
  }

  onConnect() {
    this.config.keys.forEach(
        (key) => this.client.subscribe(this.config.mqttTopicPrefix + key));
  }

  connect() {
    this.client.connect({
      userName: this.config.mqttUsername,
      password: this.config.mqttPassword,
      useSSL: this.config.mqttSsl,
      onSuccess: this.onConnect.bind(this),
    });
  }
}


angular.module('hassMqtt', [])
    .service('hassMqtt', HassMqttService);
