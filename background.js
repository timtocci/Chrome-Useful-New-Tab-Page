'use strict';
// https://raw.githubusercontent.com/pazguille/emitter-es6/master/index.js
/**
 * Creates a new instance of Emitter.
 * @class
 * @returns {Object} emitter - An instance of Emitter.
 * @example
 * var emitter = new Emitter();
 */
class Emitter {

    constructor() {
        this._events = {};
    };

    /**
     * Adds a listener to the collection for a specified event.
     * @public
     * @function
     * @name Emitter#on
     * @param {String} event - Event name.
     * @param {Function} listener - Listener function.
     * @returns {Object} emitter
     * @example
     * emitter.on('ready', listener);
     */
    on(event, listener) {
        this._events[event] = this._events[event] || [];
        this._events[event].push(listener);
        return this;
    };

    /**
     * Adds a one time listener to the collection for a specified event. It will execute only once.
     * @public
     * @function
     * @name Emitter#once
     * @param {String} event - Event name.
     * @param {Function} listener - Listener function.
     * @returns {Object} emitter
     * @example
     * me.once('contentLoad', listener);
     */
    once(event, listener) {
        let that = this;

        function fn() {
            that.off(event, fn);
            listener.apply(this, arguments);
        }

        fn.listener = listener;

        this.on(event, fn);

        return this;
    };

    /**
     * Removes a listener from the collection for a specified event.
     * @public
     * @function
     * @name Emitter#off
     * @param {String} event - Event name.
     * @param {Function} listener -  Listener function.
     * @returns {Object} emitter
     * @example
     * me.off('ready', listener);
     */
    off(event, listener) {
        let listeners = this._events[event];

        if (listeners !== undefined) {
            for (let j = 0; j < listeners.length; j += 1) {
                if (listeners[j] === listener || listeners[j].listener === listener) {
                    listeners.splice(j, 1);
                    break;
                }
            }

            if (listeners.length === 0) {
                this.removeAllListeners(event);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from the collection for a specified event.
     * @public
     * @function
     * @name Emitter#removeAllListeners
     * @param {String} event - Event name.
     * @returns {Object} emitter
     * @example
     * me.removeAllListeners('ready');
     */
    removeAllListeners(event) {
        try {
            delete this._events[event];
        } catch(e) {}

        return this;
    };

    /**
     * Returns all listeners from the collection for a specified event.
     * @public
     * @function
     * @name Emitter#listeners
     * @param {String} event - Event name.
     * @returns {Array}
     * @example
     * me.listeners('ready');
     */
    listeners(event) {
        try {
            return this._events[event];
        } catch(e) {}
    };

    /**
     * Execute each item in the listener collection in order with the specified data.
     * @name Emitter#emit
     * @public
     * @function
     * @param {String} event - The name of the event you want to emit.
     * @param {...args} [args] - Data to pass to the listeners.
     * @example
     * me.emit('ready', 'param1', {..}, [...]);
     */
    emit() {
        let args = [].slice.call(arguments, 0); // converted to array
        let event = args.shift();
        let listeners = this._events[event];

        if (listeners !== undefined) {
            listeners = listeners.slice(0);
            let len = listeners.length;
            for (let i = 0; i < len; i += 1) {
                listeners[i].apply(this, args);
            }
        }

        return this;
    };

}

/**
 * Exports Emitter

 export default Emitter;*/


/**
 * TabSets Class
 */
class TabSets extends Emitter{
    constructor() {
        super();
        chrome.bookmarks.search("__private_newtabpage", (results)=> {
            for (let fldr of results) {
                chrome.bookmarks.getChildren(fldr.id, (children)=> {
                    for (let child of children) {
                        if (child.title = "tabsets") {
                            this.tabsets_folder = child;
                            chrome.bookmarks.getChildren(child.id,(tss)=>{
                                this.TABSETS = tss;
                                // get children of each
                                this.emit("ready", tss);
                            })
                        }
                    }
                })
            }
        })
    }
    CreateTabSet(tabsetData){

    }
    DeleteTabSet(tabsetId){

    }
    DeleteTabSetURL(URLId){

    }
}

chrome.runtime.onInstalled.addListener((details)=> {
    switch (details.reason) {
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
function setDefaultOptionsData() {
    chrome.storage.sync.set({
        "optionsmenudata": [{
            item: "OpenMenu",
            active: 1
        }]
    }, ()=> {
    });
}


// Open Menu Handlers
function openBookmarks(i, t) {
    const createProperties = {url: "chrome://bookmarks"};
    chrome.tabs.create(createProperties);
}
function openHistory(i, t) {
    const createProperties = {url: "chrome://history"};
    chrome.tabs.create(createProperties);
}
function openDownloads(i, t) {
    const createProperties = {url: "chrome://downloads"};
    chrome.tabs.create(createProperties);
}
function openSettings(i, t) {
    const createProperties = {url: "chrome://settings"};
    chrome.tabs.create(createProperties);
}
function openExtensions(i, t) {
    const createProperties = {url: "chrome://extensions"};
    chrome.tabs.create(createProperties);
}
function openApps(i, t) {
    const createProperties = {url: "chrome://apps"};
    chrome.tabs.create(createProperties);
}
// Open Menu Creation
chrome.storage.sync.get('optionsmenudata', (entries)=> {
    function isActive(menu) {
        const elen = entries.optionsmenudata.length;
        for (let i = 0; i < elen; i++) {
            if (entries.optionsmenudata[i]["item"] == menu) {
                return entries.optionsmenudata[i]["active"];
            }
        }
    }

    if (isActive("OpenMenu")) {
        const hp = chrome.contextMenus.create({"title": "Open..."});
        chrome.contextMenus.create({
            "title": "Bookmarks",
            "contexts": ["page"],
            "parentId": hp,
            "onclick": openBookmarks
        });
        chrome.contextMenus.create({"title": "History", "contexts": ["page"], "parentId": hp, "onclick": openHistory});

        chrome.contextMenus.create({
            "title": "Downloads",
            "contexts": ["page"],
            "parentId": hp,
            "onclick": openDownloads
        });

        chrome.contextMenus.create({
            "title": "Settings",
            "contexts": ["page"],
            "parentId": hp,
            "onclick": openSettings
        });

        chrome.contextMenus.create({
            "title": "Extensions",
            "contexts": ["page"],
            "parentId": hp,
            "onclick": openExtensions
        });

        chrome.contextMenus.create({"title": "Apps", "contexts": ["page"], "parentId": hp, "onclick": openApps});

        // any other menu init here
    }
});
// Open Menu Options Functions
function setActive(menu) {
    chrome.storage.sync.get('optionsmenudata', (entries)=> {
        const elen = entries.optionsmenudata.length;
        for (let i = 0; i < elen; i++) {
            console.log(entries.optionsmenudata[i]["item"]);
            if (entries.optionsmenudata[i]["item"] == menu) {
                entries.optionsmenudata[i]["active"] = 1;
            }
        }
        chrome.storage.sync.set({'optionspagedata': entries.optionsmenudata}, ()=> {
        });
    });
}
function setInactive(menu) {
    chrome.storage.sync.get('optionsmenudata', (entries)=> {
        const elen = entries.optionsmenudata.length;
        for (let i = 0; i < elen; i++) {
            console.log(entries.optionsmenudata[i]["item"]);
            if (entries.optionsmenudata[i]["item"] == menu) {
                entries.optionsmenudata[i]["active"] = 0;
            }
        }
        chrome.storage.sync.set({'optionspagedata': entries.optionsmenudata}, ()=> {
        });
    });
}

// Default SearchSet Array
var searchArray = [
    {
        id: "cbGoogle",
        category: "Web Search",
        active: 1,
        label: "Google",
        url: ['https://www.google.com/search?q=']
    },
    {
        id: "cbBing",
        category: "Web Search",
        active: 0,
        label: "Bing",
        url: ["http://www.bing.com/search?q="]
    },
    {
        id: "cbYahoo",
        category: "Web Search",
        active: 0,
        label: "Yahoo",
        url: ["https://search.yahoo.com/search?p="]
    },
    {
        id: "cbDuckDuckGo",
        category: "Web Search",
        active: 0,
        label: "DuckDuckGo",
        url: ["https://duckduckgo.com/?q="]
    },
    {
        id: "cbExalead",
        category: "Web Search",
        active: 0,
        label: "Exalead",
        url: ["https://www.exalead.com/search/web/results/?q="]
    },
    {
        id: "cbGigablast",
        category: "Web Search",
        active: 0,
        label: "Gigablast",
        url: ["http://www.gigablast.com/search?q="]
    },
    {
        id: "cbFaroo",
        category: "Web Search",
        active: 0,
        label: "Faroo",
        url: ["http://www.faroo.com/#q="]
    },
    {
        id: "cbQwant",
        category: "Web Search",
        active: 0,
        label: "Qwant",
        url: ["https://www.qwant.com/?q="]
    },
    {
        id: "cbYandex",
        category: "Web Search",
        active: 0,
        label: "Yandex",
        url: ["https://www.yandex.com/yandsearch?text="]
    },
    {
        id: "cbBaidu",
        category: "Web Search",
        active: 0,
        label: "Baidu",
        url: ["http://www.baidu.com/s?wd="]
    },
    {
        id: "cbEbay",
        category: "Shopping",
        active: 0,
        label: "Ebay",
        url: ["http://www.ebay.com/sch/i.html?&_nkw="]
    },
    {
        id: "cbAmazon",
        category: "Shopping",
        active: 0,
        label: "Amazon",
        url: ["http://www.amazon.com/s/field-keywords="]
    },
    {
        id: "cbAliExpress",
        category: "Shopping",
        active: 0,
        label: "AliExpress",
        url: ["http://www.aliexpress.com/wholesale?SearchText="]
    },
    {
        id: "cbBookmarks",
        category: "Chrome Internal",
        active: 0,
        label: "Bookmarks",
        url: ["chrome://bookmarks/#q="]
    },
    {
        id: "cbHistory",
        category: "Chrome Internal",
        active: 0,
        label: "History",
        url: ["chrome://history/#q="]
    },
    {
        id: "cbYouTube",
        category: "Video",
        active: 0,
        label: "YouTube",
        url: ["http://www.youtube.com/results?search_query="]
    },
    {
        id: "cbVimeo",
        category: "Video",
        active: 0,
        label: "Vimeo",
        url: ["http://vimeo.com/search?q="]
    },
    {
        id: "cbGoogleVideo",
        category: "Video",
        active: 0,
        label: "GoogleVideo",
        url: ["https://www.google.com/search?num=100&newwindow=1&safe=off&hl=en&tbm=vid&q="]
    },
    {
        id: "cbBingVideo",
        category: "Video",
        active: 0,
        label: "BingVideo",
        url: ["http://www.bing.com/videos/search?q="]
    },
    {
        id: "cbYahooVideo",
        category: "Video",
        active: 0,
        label: "YahooVideo",
        url: ["http://video.search.yahoo.com/search/video?p="]
    },
    {
        id: "cbHulu",
        category: "Video",
        active: 0,
        label: "Hulu",
        url: ["http://www.hulu.com/search?q="]
    },
    {
        id: "cbWMHT",
        category: "Video",
        active: 0,
        label: "WMHT",
        url: ["http://video.wmht.org/search/?q="]
    },
    {
        id: "cbVeoh",
        category: "Video",
        active: 0,
        label: "Veoh",
        url: ["http://www.veoh.com/find/?query="]
    },
    {
        id: "cbBreak",
        category: "Video",
        active: 0,
        label: "Break",
        url: ["http://www.break.com/findall/?q="]
    },
    {
        id: "cbMetacafe",
        category: "Video",
        active: 0,
        label: "Metacafe",
        url: ["http://www.metacafe.com/videos_about/", "/"]
    },
    {
        id: "cbDailymotion",
        category: "Video",
        active: 0,
        label: "Dailymotion",
        url: ["http://www.dailymotion.com/us/relevance/universal/search/"]
    },
    {
        id: "cbFacebook",
        category: "Social",
        active: 0,
        label: "Facebook",
        url: ["https://www.facebook.com/search/str/", "/keywords_top"]
    },
    {
        id: "cbTwitter",
        category: "Social",
        active: 0,
        label: "Twitter",
        url: ["https://twitter.com/search?q="]
    },
    {
        id: "cbGooglePlus",
        category: "Social",
        active: 0,
        label: "GooglePlus",
        url: ["https://plus.google.com/s/"]
    },
    {
        id: "cbFoodie",
        category: "Recipes",
        active: 0,
        label: "Foodie",
        url: ["http://www.foodie.com/search?q="]
    },
    {
        id: "cbYummly",
        category: "Recipes",
        active: 0,
        label: "Yummly",
        url: ["http://www.yummly.com/recipes?q="]
    },
    {
        id: "cbMyRecipes",
        category: "Recipes",
        active: 0,
        label: "MyRecipes",
        url: ["http://www.myrecipes.com/search/site/"]
    },
    {
        id: "cbFood",
        category: "Recipes",
        active: 0,
        label: "Food",
        url: ["http://www.food.com/search/"]
    },
    {
        id: "cbCookingChannel",
        category: "Recipes",
        active: 0,
        label: "CookingChannel",
        url: ["http://www.cookingchanneltv.com/search/", "-"]
    },
    {
        id: "cbEatingWell",
        category: "Recipes",
        active: 0,
        label: "EatingWell",
        url: ["http://www.eatingwell.com/search/results/?wt=", "&sort=re"]
    },
    {
        id: "cbBettyCrocker",
        category: "Recipes",
        active: 0,
        label: "BettyCrocker",
        url: ["http://www.bettycrocker.com/search/searchresults?term="]
    },
    {
        id: "cbDogpile",
        category: "Metasearch",
        active: 0,
        label: "Dogpile",
        url: ["http://www.dogpile.com/search/web?q="]
    },
    {
        id: "cbWebcrawler",
        category: "Metasearch",
        active: 0,
        label: "Webcrawler",
        url: ["https://www.webcrawler.com/search/web?q="]
    },
    {
        id: "cbExcite",
        category: "Metasearch",
        active: 0,
        label: "Excite",
        url: ["http://msxml.excite.com/search/web?q="]
    },
    {
        id: "cbSmugmug",
        category: "Images",
        active: 0,
        label: "Smugmug",
        url: ["http://www.smugmug.com/search/?q="]
    },
    {
        id: "cbFlickr",
        category: "Images",
        active: 0,
        label: "Flickr",
        url: ["https://www.flickr.com/search/?q="]
    },
    {
        id: "cbPhotobucket",
        category: "Images",
        active: 0,
        label: "Photobucket",
        url: ["http://photobucket.com/images/"]
    },
    {
        id: "cbDeviantArt",
        category: "Images",
        active: 0,
        label: "DeviantArt",
        url: ["http://www.deviantart.com/browse/all/?q="]
    },
    {
        id: "cbImgur",
        category: "Images",
        active: 0,
        label: "Imgur",
        url: ["http://imgur.com/search?q="]
    }
];
var search_item_collection = {
    version: 0,
    items: searchArray
};


// TabSets
function getTabSets() {
}
function getTabSet(name) {
}
function setTabSet(tabset) {
}

let suTS;
function setupTabSets() {
    let bookmarksBar;
    chrome.bookmarks.getTree(function (nodesArr) {
        for (let node of nodesArr) {
            //console.log(node)
            for (let nd of node.children) {
                if (nd.title === "Other bookmarks") {
                    //console.log(nd)
                    bookmarksBar = nd;
                }
            }
        }
    });
    let fldr = {};
    fldr.title = "__private_newtabpage";
    chrome.bookmarks.create(fldr, function (nodes) {
        console.log(nodes);
        let fldrTS = {};
        fldrTS.parentId = nodes.id;
        fldrTS.title = "tabsets";
        chrome.bookmarks.create(fldrTS, function (nd) {
            console.log(nd);
        })
    });
}



// Event Listener Plumbing
chrome.runtime.onConnect.addListener(function(port) {
    switch(port.name){
        case "tabsets":
            port.onMessage.addListener(function(msg) {
                switch (msg.type){
                    case "ready":
                        let tabsets = new TabSets();
                        tabsets.on("ready",(data)=>{
                            port.postMessage({type:"ready", payload: data});
                        });
                        break;
                    case "create_tabset":
                        let tabsets = new TabSets();
                        tabsets.on("ready",(data)=>{
                            tabsets.CreateTabSet(msg.payload);
                            tabsets.on("created_tabset", (tsdata)=>{
                                port.postMessage({type:"created_tabset",payload:tsdata});
                            });
                        });
                        break;
                }
            });
            break;
        default:
        break;
    }
    //port.onMessage.addListener(function(msg) {
    //    if (msg.joke == "Knock knock")
    //        port.postMessage({question: "Who's there?"});
    //    else if (msg.answer == "Madame")
    //        port.postMessage({question: "Madame who?"});
    //    else if (msg.answer == "Madame... Bovary")
    //        port.postMessage({question: "I don't get it."});
    //});
});


//setupTabSets();
//tabsets.on("ready",(data)=>{
//    console.log(data)
//
//});