/*  Options page persistent settings stuff */
var defaultentries = [
    {
        "item":"OpenMenu",
        "active":1
    }
];
var entries = {};
if (!localStorage.getItem("entries")) {
    localStorage.setItem("entries", JSON.stringify(defaultentries));
}
entries = JSON.parse(localStorage.getItem("entries"));
function isActive(menu){
    console.log("isActive");
    var elen = entries.length;
    console.assert(!elen == 0);
    for(i=0;i<elen;i++){
        if(entries[i]["item"] == menu){
            console.log(entries[i]["item"]);
            if(entries[i]["active"] == 1){
                return true;
            }else{
                return false;
            }
        }
    }
}
function setActive(menu){
    console.log("setActive");
    var elen = entries.length;
    console.log(menu);
    console.assert(!elen == 0);
    for(i=0;i<elen;i++){
        if(entries[i]["item"] == menu){
            entries[i]["active"] = 1;
        }
    }
    localStorage.setItem("entries", JSON.stringify(entries));
}
function setInactive(menu){
    console.log("setInactive");
    var elen = entries.length;
    console.log(menu);
    console.assert(!elen == 0);
    for(i=0;i<elen;i++){
        if(entries[i]["item"] == menu){
            entries[i]["active"] = 0;
        }
    }
    localStorage.setItem("entries", JSON.stringify(entries));
}


/* Open Menu */
/* Create the context menu if active */
if(isActive("OpenMenu")){
    var hp = chrome.contextMenus.create({"title": "Open..."});

    chrome.contextMenus.create({"title": "Bookmarks", "contexts":["page"], "parentId": hp, "onclick": openBookmarks});

    function openBookmarks(i, t){
        var createProperties = {url: "chrome://bookmarks"};
        chrome.tabs.create(createProperties);
    }

    chrome.contextMenus.create({"title": "History", "contexts":["page"], "parentId": hp, "onclick": openHistory});

    function openHistory(i, t){
        var createProperties = {url: "chrome://history"};
        chrome.tabs.create(createProperties);
    }

    chrome.contextMenus.create({"title": "Downloads", "contexts":["page"], "parentId": hp, "onclick": openDownloads});

    function openDownloads(i, t){
        var createProperties = {url: "chrome://downloads"};
        chrome.tabs.create(createProperties);
    }

    chrome.contextMenus.create({"title": "Settings", "contexts":["page"], "parentId": hp, "onclick": openSettings});

    function openSettings(i, t){
        var createProperties = {url: "chrome://settings"};
        chrome.tabs.create(createProperties);
    }

    chrome.contextMenus.create({"title": "Extensions", "contexts":["page"], "parentId": hp, "onclick": openExtensions});

    function openExtensions(i, t){
        var createProperties = {url: "chrome://extensions"};
        chrome.tabs.create(createProperties);
    }

    chrome.contextMenus.create({"title": "Apps", "contexts":["page"], "parentId": hp, "onclick": openApps});

    function openApps(i, t){
        var createProperties = {url: "chrome://apps"};
        chrome.tabs.create(createProperties);
    }
}
