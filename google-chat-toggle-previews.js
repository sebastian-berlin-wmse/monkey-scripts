// ==UserScript==
// @name         Toggle previews
// @namespace    sebastian.berlin@wikimedia.se
// @version      0.1.5
// @description  Hide previews and allow toggling their visibility. Hide main chat when viewing threads.
// @author       Sebastian Berlin
// @match        https://chat.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function log(...args) {
        console.log("[Toggle previews] ", ...args);
    }

    function addMainToggle(mutation) {
        if(mutation.type !== "attributes" || !mutation.target.matches(".XN4klc.eO2Zfd")) {
            return;
        }

        let divider = mutation.target;
        let dividerHandle = divider.querySelector(".eKEW9c");
        if(dividerHandle.querySelector(".main-toggle")) {
            // Only add the button once.
            return;
        }

        let button = document.createElement("button");
        dividerHandle.appendChild(button);
        button.textContent = "◀";
        button.classList.add("main-toggle");
        button.addEventListener("click", e => {
            let main = document.querySelector(".RWqrJc");
            main.hidden = !main.hidden;
        });
    }

    function addPreviewToggles(mutation) {
        for(let node of mutation.addedNodes) {
            if(node instanceof Element) {
                let previews = node.querySelectorAll(".QPe6Ge");
                for(let preview of previews) {
                    let content = preview.firstChild;
                    if(!content.hasChildNodes()) {
                        continue;
                    }

                    if(preview.parentNode.querySelector(".preview-toggle")) {
                        // Toggle has already been added here.
                        continue;
                    }

                    let button = document.createElement("button");
                    button.textContent = "▼";
                    button.classList.add("preview-toggle");
                    if(preview.matches(".nF6pT.yqoUIf.Fxfmxb .QPe6Ge .kwI9i.zX644e.yqoUIf.n3AJp")) {
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
        `.preview-toggle.your:has(~ .QPe6Ge[hidden]) {
             rotate: 90deg;
         }`
    );
    sheet.insertRule(
        `.preview-toggle.others:has(~ .QPe6Ge[hidden]) {
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
    sheet.insertRule(
        `.main-toggle {
             position: relative;
             left: -7px;
             top: 50%;
             transform: translateY(-50%);
             color: var(--secondary-text-color);
             padding: 2px;
             padding-left: 1px;
             background: var(--background-color);
             border: solid 2px var(--gm3-color-outline);
             border-radius: 50%;
         }`
    );
    sheet.insertRule(
        `.RWqrJc[hidden] ~ .XN4klc.eO2Zfd .main-toggle {
             rotate: 180deg;
             transform: translateY(50%);
         }`
    );

    log("Starting...");
    let observer = new MutationObserver((records) => {
        records.forEach((mutation) => {
            addPreviewToggles(mutation);
            addMainToggle(mutation);
        });
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true
    });

})();

