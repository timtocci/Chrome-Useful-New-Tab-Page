chrome.runtime.onInstalled.addListener((details)=>{
    switch (details.reason){
        case "install":
            setDefaultOptionsData();
            break;
        case "update":
            setDefaultOptionsData();
            break;
        case "chromeupdate":
            // browser update - do nothing
            break;
        default:
            setDefaultOptionsData();
            break;
    }
});
function setDefaultOptionsData(){
    chrome.storage.sync.set({"optionsmenudata":
    [{
        item: "OpenMenu",
        active: 1
    }]
    }, ()=>{});
}
//setDefaultOptionsData()
chrome.storage.sync.get('optionsmenudata',(entries)=>{
    function isActive(menu) {
        const elen = entries.optionsmenudata.length;
        for (i = 0; i < elen; i++) {
            if (entries.optionsmenudata[i]["item"] == menu) {
                return entries.optionsmenudata[i]["active"];
            }
        }
    }
    if (isActive("OpenMenu")) {
        const hp = chrome.contextMenus.create({"title": "Open..."});
        chrome.contextMenus.create({"title": "Bookmarks", "contexts": ["page"], "parentId": hp, "onclick": openBookmarks});
        function openBookmarks(i, t) {
            const createProperties = {url: "chrome://bookmarks"};
            chrome.tabs.create(createProperties);
        }
        chrome.contextMenus.create({"title": "History", "contexts": ["page"], "parentId": hp, "onclick": openHistory});
        function openHistory(i, t) {
            const createProperties = {url: "chrome://history"};
            chrome.tabs.create(createProperties);
        }
        chrome.contextMenus.create({"title": "Downloads", "contexts": ["page"], "parentId": hp, "onclick": openDownloads});
        function openDownloads(i, t) {
            const createProperties = {url: "chrome://downloads"};
            chrome.tabs.create(createProperties);
        }
        chrome.contextMenus.create({"title": "Settings", "contexts": ["page"], "parentId": hp, "onclick": openSettings});
        function openSettings(i, t) {
            const createProperties = {url: "chrome://settings"};
            chrome.tabs.create(createProperties);
        }
        chrome.contextMenus.create({
            "title": "Extensions",
            "contexts": ["page"],
            "parentId": hp,
            "onclick": openExtensions
        });
        function openExtensions(i, t) {
            const createProperties = {url: "chrome://extensions"};
            chrome.tabs.create(createProperties);
        }
        chrome.contextMenus.create({"title": "Apps", "contexts": ["page"], "parentId": hp, "onclick": openApps});
        function openApps(i, t) {
            const createProperties = {url: "chrome://apps"};
            chrome.tabs.create(createProperties);
        }
        // any other menu init here
    }
});
function setActive(menu){
    chrome.storage.sync.get('optionsmenudata',(entries)=>{
        const elen = entries.optionsmenudata.length;
        for (let i = 0; i < elen; i++) {
            console.log(entries.optionsmenudata[i]["item"]);
            if (entries.optionsmenudata[i]["item"] == menu) {
                entries.optionsmenudata[i]["active"] = 1;
            }
        }
        chrome.storage.sync.set({'optionspagedata':entries.optionsmenudata}, ()=>{});
    });
}
function setInactive(menu){
    chrome.storage.sync.get('optionsmenudata',(entries)=>{
        const elen = entries.optionsmenudata.length;
        for (let i = 0; i < elen; i++) {
            console.log(entries.optionsmenudata[i]["item"]);
            if (entries.optionsmenudata[i]["item"] == menu) {
                entries.optionsmenudata[i]["active"] = 0;
            }
        }
        chrome.storage.sync.set({'optionspagedata':entries.optionsmenudata}, ()=>{});
    });
}
