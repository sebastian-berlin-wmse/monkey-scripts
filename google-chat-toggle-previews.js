// ==UserScript==
// @name         Toggle previews
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Hide previews and allow toggling their visibility.
// @author       Sebastian Berlin
// @match        https://chat.google.com/u/0/frame?shell=9&origin=https%3A%2F%2Fmail.google.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function log(...args) {
        console.log("[Toggle previews] ", ...args);
    }

    let style = document.createElement("style")
    document.head.appendChild(style)
    let sheet = Array.from(document.styleSheets).at(-1);
    sheet.insertRule(
        `.preview-toggle {
            background: transparent;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 30px;
        }`
    );
    sheet.insertRule(
        `.preview-toggle:hover {
             background-color: var(--list-item-hover-bg-color);
         }`
    );
    sheet.insertRule(
        `.preview-toggle.your:has(+ .QPe6Ge[hidden]) {
            rotate: 90deg;
        }`
    );
    sheet.insertRule(
        `.preview-toggle.others:has(+ .QPe6Ge[hidden]) {
            rotate: -90deg;
        }`
    );
    sheet.insertRule(
        `.preview-toggle.your {
            align-self: end;
        }`
    );
    sheet.insertRule(
        `.preview-toggle.others {
            align-self: start;
        }`
    );

    log("Starting...");
    let observer = new MutationObserver((records) => {
        records.forEach((mutation) => {
            if(!mutation.addedNodes) {
                return;
            }

            for(let node of mutation.addedNodes) {
                if(node instanceof Element) {
                    let previews = node.querySelectorAll(".QPe6Ge");
                    if(previews.length == 0) {
                        return;
                    }

                    for(let preview of previews) {
                        let content = preview.firstChild;
                        if(!content.hasChildNodes()) {
                            continue;
                        }

                        let button = document.createElement("button");
                        button.textContent = "▼";
                        button.classList.add("preview-toggle");
                        if(preview.matches(".nF6pT.yqoUIf.Fxfmxb .QPe6Ge")) {
                            button.classList.add("your");
                        } else {
                            button.classList.add("others");
                        }
                        button.addEventListener("click", () => {
                            preview.hidden = !preview.hidden
                        });
                        preview.before(button);
                        log("Added button", button, "for", preview);

                        preview.hidden = true;
                    }
                }
            }
        });
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true
    });

})();
