// ==UserScript==
// @name         Fortnox flex
// @namespace    sebastian.berlin@wikimedia.se
// @version      0.1.0
// @description  Highlight flex time rows
// @author       Sebastian Berlin
// @match        https://*.fortnox.se/time-reporting/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fortnox.se
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver((records) => {
        records.forEach((mutation) => {
            if(mutation.addedNodes) {
                for(let node of mutation.addedNodes) {
                    if(node.textContent === "Flextid +") {
                        let row = node.parentElement.closest("tr");
                        row.style.background = "salmon";
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
