// ==UserScript==
// @name         YouTube Chat Switcher v1.6
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Switch YouTube live chat from "Top Chat" to "Chat" automatically and remember the switch
// @author       Your Name
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SWITCHED_KEY = 'yt_chat_switched';

    function switchChat() {
        const chatMenuButton = document.querySelector('yt-live-chat-header-renderer #trigger');
        if (chatMenuButton) {
            chatMenuButton.click();
            setTimeout(() => {
                const chatOptions = document.querySelectorAll('tp-yt-paper-listbox tp-yt-paper-item');
                chatOptions.forEach(option => {
                    if (option.innerText.includes('チャット') && !option.innerText.includes('トップチャット')) {
                        option.click();
                        localStorage.setItem(SWITCHED_KEY, 'true');
                    }
                });
            }, 500);
        } else {
//          console.error('チャットメニューボタンが見つかりません。');
        }
    }

    function checkAndSwitchChat() {
        if (!localStorage.getItem(SWITCHED_KEY)) {
            switchChat();
        } else {
//          console.log('「チャット」に既に切り替え済みです。');
        }
    }

    function observePage() {
        const observer = new MutationObserver(() => {
            checkAndSwitchChat();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Reset the flag on each page load to ensure the switch happens after reload
    localStorage.removeItem(SWITCHED_KEY);

    // Wait for the page to fully load
    window.addEventListener('load', () => {
        setTimeout(() => {
            checkAndSwitchChat();
            observePage();
        }, 2000);
    });

})();
