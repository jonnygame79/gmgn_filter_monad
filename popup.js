// Popup script for GMGN Filter Extension
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Get DOM elements
    const statusText = document.getElementById('status-text');
    const openFiltersBtn = document.getElementById('open-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');

    // Check if we're on the correct page
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;

        if (url && url.includes('gmgn.ai/sol/address/')) {
            statusText.textContent = 'Extension is active on gmgn.ai';
            openFiltersBtn.disabled = false;
            clearFiltersBtn.disabled = false;
        } else {
            statusText.textContent = 'Please navigate to gmgn.ai/sol/address/ to use filters';
            openFiltersBtn.disabled = true;
            clearFiltersBtn.disabled = true;
        }
    });

    // Open filters button
    openFiltersBtn.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'openFilters' }, function (response) {
                if (chrome.runtime.lastError) {
                    console.log('Error:', chrome.runtime.lastError);
                }
            });
        });
    });

    // Clear filters button
    clearFiltersBtn.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'clearFilters' }, function (response) {
                if (chrome.runtime.lastError) {
                    console.log('Error:', chrome.runtime.lastError);
                }
            });
        });
    });
}); 