dashApp.value('hassMqttConfig', {
  mqttHost: 'example.org',
  mqttPort: 9001,
  mqttUsername: 'user',
  mqttPassword: 'password',
  mqttSsl: true,
  mqttTopicPrefix: 'ha/states/',
  // List of keys to subscribe to, or '#' to subscribe to everything.
  keys: [
    '#',
  ]
});
