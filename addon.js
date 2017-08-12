/*
 chrome.runtime.getBackgroundPage(function(bgPage) {
 //bgPage[tab.url] = data;
 });
 */

var search_items_array = [];
/**
 *  Displays Top Sites
 * @param topSitesArray
 */
function displayTopSites(topSitesArray) {
    var mostVisitedDiv = document.getElementById('mostVisited_div');
    var ul = mostVisitedDiv.appendChild(document.createElement('ul'));
    for (var i = 0; i < topSitesArray.length; i++) {
        var li = ul.appendChild(document.createElement('li'));
        var a = li.appendChild(document.createElement('a'));
        a.href = topSitesArray[i].url;
        a.appendChild(document.createTextNode(topSitesArray[i].title));
    }
}

/**
 *  Displays Recently Bookmarked Sites
 * @param recentlyBookmarkedArray
 */
function displayRecentlyBookmarked(recentlyBookmarkedArray) {
    var recentlyBookmarkedDiv = document.getElementById('recentlyBookmarked_div');
    var ul = recentlyBookmarkedDiv.appendChild(document.createElement('ul'));
    for (var i = 0; i < recentlyBookmarkedArray.length; i++) {
        var li = ul.appendChild(document.createElement('li'));
        var a = li.appendChild(document.createElement('a'));
        a.href = recentlyBookmarkedArray[i].url;
        a.appendChild(document.createTextNode(recentlyBookmarkedArray[i].title));
    }
}

/**
 * Retrieves and displays Recently Visited Sites
 */
function getRecentlyVisited() {
    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
    var recentlyVisitedDiv = document.getElementById('recentlyVisited_div');
    var ul = recentlyVisitedDiv.appendChild(document.createElement('ul'));
    chrome.history.search({
        'text': '',
        'startTime': oneWeekAgo
    }, function (historyItems) {
        for (var i = 0; i < historyItems.length; ++i) {
            var url = historyItems[i].url;
            var title = historyItems[i].title;
            var li = ul.appendChild(document.createElement('li'));
            var a = li.appendChild(document.createElement('a'));
            a.href = url;
            if (!title) {
                a.className = 'color-gray-50 smaller';
                a.appendChild(document.createTextNode('-----NO TITLE-----'));
            } else {
                title = title.substring(0,29) + "...";
                a.appendChild(document.createTextNode(title));
            }
        }
    });
}

/**
 * Handles link click inside of addon
 * @param e Click Event
 * @returns {boolean}
 */
function onChromeUrlClick(e) {
    e.preventDefault();
    chrome.tabs.create({url: e.srcElement.href});
    return false;
}

/**
 * Opens a new tab
 * @param href
 */
function openTab(href) {
    chrome.tabs.create({url: href});
}

/**
 * Replaces current tab
 * @param href
 */
function replaceTab(href) {
    chrome.tabs.getCurrent(function (tab) {
        openTab(href);
        chrome.tabs.remove(tab.id);
    });
}

/**
 * Initializes Click Listeners for Chrome URLs
 */
function initializeNavMenu() {

    var links = document.getElementsByClassName('chromeurls');

    for (i = 0; i < links.length; i++) {
        links[i].addEventListener('click', onChromeUrlClick);
    }
}


/**
 * Opens a tab set
 * @param name
 * @param evt

function openTabSet(name, evt) {
    name = name.trim();
    if(name == "+"){

        //$(evt.target).parent().parent().parent().children(".tabset_items").css("display", "block");
        let tabitems = $(evt.target).parent().parent().parent().children(".tabset_items");
        tabitems.css("display", "block");
        evt.target.textContent = "-";

    }else if(name == "-"){
        //console.log(evt)
        let tabitems = $(evt.target).parent().parent().parent().children(".tabset_items");
        tabitems.css("display", "none");
        evt.target.textContent = "+";
    }
    else{
        console.log('openTabSet with ' + name);
        var tabset;
        chrome.runtime.getBackgroundPage(function (bgPage) {
            var tabsets = bgPage.Me.db.TabSets;
            if (tabsets) {
                console.log(tabsets);
                for (var i = 0; i < tabsets.length; i++) {
                    if (tabsets[i].name === name) {
                        tabset = tabsets[i];
                        var urls = tabset.urls;
                        for (var ii = 0; ii < urls.length; ii++) {
                            chrome.tabs.create({url: urls[ii]});
                        }
                    }
                }
            }
        });
    }
}
*/

/**
 * Initializes the search pane
 */
function initializeSearch() {
    chrome.runtime.getBackgroundPage(function (bgPage) {
        // bypass data version check for now
        search_items_array = bgPage.search_item_collection.items;
        var categoryArr = [];
        var inserthtml = "";
        // fill the category array
        for (let item of search_items_array) {
            if (categoryArr.lastIndexOf(item.category) === -1) {
                categoryArr.push(item.category);
            }
        }
        // create the html to insert
        for (let category of categoryArr) {
            inserthtml += '<label><strong>' + category + '</strong><ul class="forms-inline-list">';
            for (let item of search_items_array) {
                if (item.category === category) {
                    if (item.active) {
                        inserthtml += `<li><input type="checkbox" name="${item.id}" id="${item.id}" checked><label for="${item.id}">${item.label}</label></li>`;
                    } else {
                        inserthtml += `<li><input type="checkbox" name="${item.id}" id="${item.id}"><label for="${item.id}">${item.label}</label></li>`;
                    }
                }
            }
            inserthtml += '</ul></label>';
        }
        document.getElementById('search_settings_container').innerHTML = inserthtml;
    });
}

function showTabsetItems(index){
    $(".tabset .tabset_items").each(function (idx) {
        if(idx === index){
            $(this).toggle("display")
        }
    });
    $(".tabset .tabset_title_delete").each(function (idx) {
        if(idx === index){
            $(this).css("visibility", "visible")
        }
    });
}
function hideTabsetItems(index){
    $(".tabset .tabset_items").each(function (idx) {
        if(idx === index){
            $(this).toggle("display")
        }
    });
    $(".tabset .tabset_title_delete").each(function (idx) {
        if(idx === index){
            $(this).css("visibility", "hidden")
        }
    });
}
window.onload = function () {
    var createbutton = document.getElementById('btnCreateSearchSet');
    createbutton.addEventListener('click', function (e) {
        e.preventDefault();
        var objQueryInfo = {
            windowType: "normal"
        };
        chrome.runtime.getBackgroundPage(function (bgPage) {
            chrome.tabs.query(objQueryInfo, function (tabArray) {
                console.log(tabArray);
                //bgPage.Me.tabs = tabArray;
                replaceTab('searchsets.html');
            });
        });
    });
    var createtabsetbutton = document.getElementById('btnCreateTabSet');
    createtabsetbutton.addEventListener('click', function (e) {
        e.preventDefault();
        replaceTab('tabsets.html');
    });






    // ToDo: Add document nodes before this listener
    $(".tabset .tabset_title_expand").each(function(idx){
        $(this).bind("click", function(){
            $(this).children().each(function(){
                if($(this).text() === "+"){
                    $(this).text("-");
                    showTabsetItems(idx)
                }else{
                    $(this).text("+");
                    hideTabsetItems(idx)
                }
            }) ;
        });
    });

    // initialize search pane
    initializeSearch();

    // handle search button
    var searchbutton = document.getElementById('btnSearch');
    searchbutton.addEventListener('click', function (e) {
        e.preventDefault();
        var term = document.getElementById('txtSearch').value;
        if (term === "" || term === 'No Empty Queries Allowed') {
            document.getElementById('txtSearch').value = 'No Empty Queries Allowed';
        } else {
            var container = document.getElementById('search_settings_container');
            var cbItems = container.getElementsByTagName('input');
            for (let item of cbItems) {
                if (item.type === 'checkbox' && item.checked) {
                    for (let sitem of search_items_array) {
                        if (item.id === sitem.id) {
                            let url = sitem.url[0] + encodeURIComponent(term);
                            if (sitem.url.length > 1) {
                                url += sitem.url[1]
                            }
                            openTab(url);
                        }
                    }
                }
            }
        }
    });

    chrome.runtime.sendMessage({type: "ready"}, function(response) {
        console.log(response.type);
    });
    chrome.runtime.sendMessage({type: "delete_tabset"}, function(response) {
        console.log(response.type);
    });
    chrome.runtime.sendMessage({type: "delete_tabset_item"}, function(response) {
        console.log(response.type);
    });


    // display links
    chrome.topSites.get(displayTopSites);
    chrome.bookmarks.getRecent(80, displayRecentlyBookmarked);
    getRecentlyVisited();
    initializeNavMenu();
};