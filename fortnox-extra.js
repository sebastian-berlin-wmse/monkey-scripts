// ==UserScript==
// @name         Fortnox extra
// @namespace    sebastian.berlin@wikimedia.se
// @version      0.1.3
// @description  Make Fortnox time reporting a bit better
// @author       Sebastian Berlin
// @match        https://*.fortnox.se/time-reporting/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fortnox.se
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver((records) => {
        records.forEach((mutation) => {
            if(!mutation.addedNodes) {
                return;
            }

            for(let node of mutation.addedNodes) {
                if(node.textContent === "Flextid +") {
                    let row = node.parentElement.closest("tr");
                    row.style.background = "salmon";
                } else if(node.textContent.startsWith("Övertid ")) {
                    let row = node.parentElement.closest("tr");
                    row.style.background = "plum";
                } else if(node instanceof Element) {
                    let saveButton = node.querySelector(".dialog .button.button-green");
                    if(!saveButton) {
                        return;
                    }

                    node.addEventListener("keydown", (event) => {
                        if (event.ctrlKey && event.key === "Enter") {
                            // Looks like the keydown event also happens, so focusing is enough.
                            saveButton.focus();
                        }
                    });
                }
            }
        });
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true
    });
})();
