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




var searchArray = [
    {
        id:"cbGoogle",
        category: "Web Search",
        active: 1,
        label: "Google",
        url:'https://www.google.com/search?q=' + encodeURIComponent(term)
    },
    {
        id:"cbBing",
        category: "Web Search",
        active: 1,
        label: "Bing",
        url:"http://www.bing.com/search?q=" + encodeURIComponent(term)
    },
    {
        id:"cbYahoo",
        category: "Web Search",
        active: 1,
        label: "Yahoo",
        url:"https://search.yahoo.com/search?p=" + encodeURIComponent(term)
    },
    {
        id:"cbDuckDuckGo",
        category: "Web Search",
        active: 1,
        label: "DuckDuckGo",
        url:"https://duckduckgo.com/?q=" + encodeURIComponent(term)
    },
    {
        id:"cbExalead",
        category: "Web Search",
        active: 1,
        label: "Exalead",
        url:"https://www.exalead.com/search/web/results/?q=" + encodeURIComponent(term)
    },
    {
        id:"cbGigablast",
        category: "Web Search",
        active: 1,
        label: "Gigablast",
        url:"http://www.gigablast.com/search?q=" + encodeURIComponent(term)
    },
    {
        id:"cbFaroo",
        category: "Web Search",
        active: 1,
        label: "Faroo",
        url:"http://www.faroo.com/#q=" + encodeURIComponent(term)
    },
    {
        id:"cbQwant",
        category: "Web Search",
        active: 1,
        label: "Qwant",
        url:"https://www.qwant.com/?q=" + encodeURIComponent(term)
    },
    {
        id:"cbYandex",
        category: "Web Search",
        active: 1,
        label: "Yandex",
        url:"https://www.yandex.com/yandsearch?text=" + encodeURIComponent(term)
    },
    {
        id:"cbBaidu",
        category: "Web Search",
        active: 1,
        label: "Baidu",
        url:"http://www.baidu.com/s?wd=" + encodeURIComponent(term)
    },
    {
        id:"cbEbay",
        category: "Shopping",
        active: 1,
        label: "Ebay",
        url:"http://www.ebay.com/sch/i.html?&_nkw=" + encodeURIComponent(term)
    },
    {
        id:"cbAmazon",
        category: "Shopping",
        active: 1,
        label: "Amazon",
        url:"http://www.amazon.com/s/field-keywords=" + encodeURIComponent(term)
    },
    {
        id:"cbAliExpress",
        category: "Shopping",
        active: 1,
        label: "AliExpress",
        url:"http://www.aliexpress.com/wholesale?SearchText=" + encodeURIComponent(term)
    },
    {
        id:"cbBookmarks",
        category: "Chrome Internal",
        active: 1,
        label: "Bookmarks",
        url:"chrome://bookmarks/#q=" + term
    },
    {
        id:"cbHistory",
        category: "Chrome Internal",
        active: 1,
        label: "History",
        url:"chrome://history/#q=" + term
    },
    {
        id:"cbYouTube",
        category: "Video",
        active: 1,
        label: "YouTube",
        url:"http://www.youtube.com/results?search_query=" + encodeURIComponent(term)
    },
    {
        id:"cbVimeo",
        category: "Video",
        active: 1,
        label: "Vimeo",
        url:"http://vimeo.com/search?q=" + encodeURIComponent(term)
    },
    {
        id:"cbGoogleVideo",
        category: "Video",
        active: 1,
        label: "GoogleVideo",
        url:"https://www.google.com/search?num=100&newwindow=1&safe=off&hl=en&tbm=vid&q=" + encodeURIComponent(term)
    },
    {
        id:"cbBingVideo",
        category: "Video",
        active: 1,
        label: "BingVideo",
        url:"http://www.bing.com/videos/search?q=" + encodeURIComponent(term)
    },
    {
        id:"cbYahooVideo",
        category: "Video",
        active: 1,
        label: "YahooVideo",
        url:"http://video.search.yahoo.com/search/video?p=" + encodeURIComponent(term)
    },
    {
        id:"cbHulu",
        category: "Video",
        active: 1,
        label: "Hulu",
        url:"http://www.hulu.com/search?q=" + encodeURIComponent(term)
    },
    {
        id:"cbWMHT",
        category: "Video",
        active: 1,
        label: "WMHT",
        url:"http://video.wmht.org/search/?q=" + encodeURIComponent(term)
    },
    {
        id:"cbVeoh",
        category: "Video",
        active: 1,
        label: "Veoh",
        url:"http://www.veoh.com/find/?query=" + encodeURIComponent(term)
    },
    {
        id:"cbBreak",
        category: "Video",
        active: 1,
        label: "Break",
        url:"http://www.break.com/findall/?q=" + encodeURIComponent(term)
    },
    {
        id:"cbMetacafe",
        category: "Video",
        active: 1,
        label: "Metacafe",
        url:"http://www.metacafe.com/videos_about/" + encodeURIComponent(term) + "/"
    },
    {
        id:"cbDailymotion",
        category: "Video",
        active: 1,
        label: "Dailymotion",
        url:"http://www.dailymotion.com/us/relevance/universal/search/" + encodeURIComponent(term)
    },
    {
        id:"cbFacebook",
        category: "Social",
        active: 1,
        label: "Facebook",
        url:"https://www.facebook.com/search/str/" + encodeURIComponent(term) + "/keywords_top"
    },
    {
        id:"cbTwitter",
        category: "Social",
        active: 1,
        label: "Twitter",
        url:"https://twitter.com/search?q=" + encodeURIComponent(term)
    },
    {
        id:"cbGooglePlus",
        category: "Social",
        active: 1,
        label: "GooglePlus",
        url:"https://plus.google.com/s/" + encodeURIComponent(term)
    },
    {
        id:"cbFoodie",
        category: "Recipes",
        active: 1,
        label: "Foodie",
        url:"http://www.foodie.com/search?q=" + encodeURIComponent(term)
    },
    {
        id:"cbYummly",
        category: "Recipes",
        active: 1,
        label: "Yummly",
        url:"http://www.yummly.com/recipes?q=" + encodeURIComponent(term)
    },
    {
        id:"cbGoogleRecipes",
        category: "Recipes",
        active: 1,
        label: "GoogleRecipes",
        url:"https://www.google.com/search?q=" + encodeURIComponent(term) + '&tbs=rcp%3A1'
    },
    {
        id:"cbMyRecipes",
        category: "Recipes",
        active: 1,
        label: "MyRecipes",
        url:"http://www.myrecipes.com/search/site/" + encodeURIComponent(term)
    },
    {
        id:"cbFood",
        category: "Recipes",
        active: 1,
        label: "Food",
        url:"http://www.food.com/search/" + encodeURIComponent(term)
    },
    {
        id:"cbCookingChannel",
        category: "Recipes",
        active: 1,
        label: "CookingChannel",
        url:"http://www.cookingchanneltv.com/search-results.html?searchTerm=" + encodeURIComponent(term)
    },
    {
        id:"cbEatingWell",
        category: "Recipes",
        active: 1,
        label: "EatingWell",
        url:"http://www.eatingwell.com/search/apachesolr_search/" + encodeURIComponent(term)
    },
    {
        id:"cbBettyCrocker",
        category: "Recipes",
        active: 1,
        label: "BettyCrocker",
        url:"http://www.bettycrocker.com/search/searchresults?term=" + encodeURIComponent(term)
    },
    {
        id:"cbHotbot",
        category: "Metasearch",
        active: 1,
        label: "Hotbot",
        url:"http://www.hotbot.com/search/web?q=" + encodeURIComponent(term) + "&keyvol=01e32e5055bc4ba0f3e4"
    },
    {
        id:"cbDogpile",
        category: "Metasearch",
        active: 1,
        label: "Dogpile",
        url:"http://www.dogpile.com/search/web?q=" + encodeURIComponent(term)
    },
    {
        id:"cbWebcrawler",
        category: "Metasearch",
        active: 1,
        label: "Webcrawler",
        url:"https://www.webcrawler.com/search/web?q=" + encodeURIComponent(term)
    },
    {
        id:"cbExcite",
        category: "Metasearch",
        active: 1,
        label: "Excite",
        url:"http://msxml.excite.com/search/web?q=" + encodeURIComponent(term)
    },
    {
        id:"cbSmugmug",
        category: "Images",
        active: 1,
        label: "Smugmug",
        url:"http://www.smugmug.com/search/?q=" + encodeURIComponent(term)
    },
    {
        id:"cbFlickr",
        category: "Images",
        active: 1,
        label: "Flickr",
        url:"https://www.flickr.com/search/?q=" + encodeURIComponent(term)
    },
    {
        id:"cbPhotobucket",
        category: "Images",
        active: 1,
        label: "Photobucket",
        url:"http://photobucket.com/images/" + encodeURIComponent(term)
    },
    {
        id:"cbDeviantArt",
        category: "Images",
        active: 1,
        label: "DeviantArt",
        url:"http://www.deviantart.com/browse/all/?q=" + encodeURIComponent(term)
    },
    {
        id:"cbImgur",
        category: "Images",
        active: 1,
        label: "Imgur",
        url:"http://imgur.com/search?q=" + encodeURIComponent(term)
    }
];
var search_item_collection = {
    version: 0,
    items: searchArray
};