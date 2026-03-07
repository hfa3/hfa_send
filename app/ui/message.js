const html = require('choo/html');

module.exports = function (message) {
  return html`
    <send-message class="alert success">
      <div class="w-full">${message}</div>
    </send-message>
  `;
};
