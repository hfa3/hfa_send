const html = require('choo/html');
const { copyToClipboard } = require('../utils');
const assets = require('../../common/assets');
const message = require('./message');
const qr = require('./qr');

module.exports = function (name, url, password) {
  const dialog = function (state, emit, close) {
    return html`
      <send-copy-dialog
        class="flex flex-col items-center text-center p-4 max-w-md m-auto relative"
      >
        <h1 class="text-3xl font-bold my-4">
          ${state.translate('notifyUploadEncryptDone')}
        </h1>
        <p
          class="font-normal leading-normal text-grey-80 word-break-all dark:text-grey-40"
        >
          ${state.translate('copyLinkDescription')} <strong>${name}</strong>
        </p>
        <div class="flex flex-row items-center justify-center w-full">
          <input
            type="text"
            id="share-url"
            class="block w-full my-4 border-default rounded-lg leading-loose h-12 px-2 py-1 dark:bg-grey-80"
            value="${url}"
            readonly="true"
          />
          <button
            id="qr-btn"
            class="w-16 m-1 p-1"
            onclick="${toggleQR}"
            title="QR code"
          >
            ${qr(url)}
          </button>
          <button
            class="btn reversed icon-btn rounded-lg w-auto flex-shrink-0 focus:outline"
            onclick="${copyUrl}"
            title="${state.translate('copyLinkButton')}"
          >
            <svg class="h-6 w-6">
              <use xlink:href="${assets.get('copy-16.svg')}#icon" />
            </svg>
          </button>
        </div>
        ${showPasswordInfo(password)}
        <button
          class="link-primary my-4 font-medium cursor-pointer focus:outline"
          onclick="${close}"
          title="${state.translate('okButton')}"
        >
          ${state.translate('okButton')}
        </button>
      </send-copy-dialog>
    `;

    function toggleQR(event) {
      event.stopPropagation();
      const shareUrl = document.getElementById('share-url');
      const qrBtn = document.getElementById('qr-btn');
      if (shareUrl.classList.contains('hidden')) {
        shareUrl.classList.replace('hidden', 'block');
        qrBtn.classList.replace('w-48', 'w-16');
      } else {
        shareUrl.classList.replace('block', 'hidden');
        qrBtn.classList.replace('w-16', 'w-48');
      }
    }

    function copyUrl(event) {
      event.stopPropagation();
      copyToClipboard(url);
      copySuccess();
      setTimeout(function () {
        removeAlert();
      }, 1000);
    }

    function copyPwd(event) {
      event.stopPropagation();
      copyToClipboard(password);
      copySuccess();
      setTimeout(function () {
        removeAlert();
      }, 1000);
    }

    function copySuccess(event) {
      const container = document.getElementsByTagName('send-copy-dialog');
      const msg = message('copied!');
      container[0].appendChild(msg);
    }

    function removeAlert(event) {
      const alerts = document.querySelectorAll('send-message');
      for (var alert of alerts) {
        alert.remove();
      }
    }

    function showPasswordInfo(password) {
      if (password !== undefined)
        return html`
          <p
            class="pt-6 font-normal leading-normal text-grey-80 word-break-all dark:text-grey-40"
          >
            ${state.translate('copyPwdDescription')}
          </p>
          <div class="flex flex-row items-center justify-center w-full">
            <input
              type="text"
              id="share-password"
              class="block w-full my-4 border-default rounded-lg leading-loose h-12 px-2 py-1 dark:bg-grey-80"
              value="${password}"
              readonly="true"
            />
            <button
              class="btn reversed icon-btn rounded-lg w-auto flex-shrink-0 focus:outline ml-4"
              onclick="${copyPwd}"
              title="${state.translate('copyPwdButton')}"
            >
              <svg class="h-6 w-6">
                <use xlink:href="${assets.get('copy-16.svg')}#icon" />
              </svg>
            </button>
          </div>
        `;
      else return;
    }
  };
  dialog.type = 'copy';
  return dialog;
};
