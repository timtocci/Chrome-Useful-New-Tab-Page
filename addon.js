/*
 chrome.runtime.getBackgroundPage(function(bgPage) {
 //bgPage[tab.url] = data;
 });
 */

/**
 *  Displays Top Sites
 * @param topSitesArray
 */
function displayTopSites(topSitesArray){
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
function displayRecentlyBookmarked(recentlyBookmarkedArray){
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
function getRecentlyVisited(){
	var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
	var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
	var recentlyVisitedDiv = document.getElementById('recentlyVisited_div');
	var ul = recentlyVisitedDiv.appendChild(document.createElement('ul'));
	chrome.history.search({
		'text': '',
		'startTime': oneWeekAgo
	}, function(historyItems){
		for (var i = 0; i < historyItems.length; ++i) {
			var url = historyItems[i].url;
			var title = historyItems[i].title;
			var li = ul.appendChild(document.createElement('li'));
			var a = li.appendChild(document.createElement('a'));
			a.href = url;
			if(! title){
				a.className = 'color-gray-50 smaller'
				a.appendChild(document.createTextNode('-----NO TITLE-----'));
			}else{
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
function onChromeUrlClick(e){
	e.preventDefault();
	chrome.tabs.create({ url: e.srcElement.href });
	return false;
}

/**
 * Opens a new tab
 * @param href
 */
function openTab(href){
	chrome.tabs.create({ url: href });
}

/**
 * Replaces current tab
 * @param href
 */
function replaceTab(href){
	chrome.tabs.getCurrent(function (tab){
		openTab(href);
		chrome.tabs.remove(tab.id);
	});
}

/**
 * Initializes Click Listeners for Chrome URLs
 */
function initializeNavMenu(){

	var links = document.getElementsByClassName('chromeurls');

	for(i=0;i<links.length;i++){
		links[i].addEventListener('click', onChromeUrlClick);
	}
}




/**
 * Opens a tab set
 * @param name
 */
function openTabSet(name){
	console.log('openTabSet with ' + name);
	var tabset;
	chrome.runtime.getBackgroundPage(function(bgPage) {
		var tabsets = bgPage.Me.db.TabSets;
		if(tabsets){
			console.log(tabsets);
			for(var i = 0; i < tabsets.length; i++){
				if(tabsets[i].name === name){
					tabset = tabsets[i];
					var urls = tabset.urls;
					for(var ii=0;ii<urls.length;ii++){
						chrome.tabs.create({url:urls[ii]});
					}
				}
			}
		}
	});
}

window.onload = function(){
	var createbutton = document.getElementById('btnCreateSearchSet');
	createbutton.addEventListener('click', function(e){
		e.preventDefault();
		var objQueryInfo = {
			windowType: "normal"
		};
		chrome.runtime.getBackgroundPage(function(bgPage) {
			chrome.tabs.query(objQueryInfo, function(tabArray){
				console.log(tabArray);
				//bgPage.Me.tabs = tabArray;
				replaceTab('searchsets.html');
			});
		});
	});
	var createtabsetbutton = document.getElementById('btnCreateTabSet');
	createtabsetbutton.addEventListener('click', function(e){
		e.preventDefault();
		replaceTab('tabsets.html');
	});

	var tabsetdisplay = document.getElementById('tabsetdisplay');
	tabsetdisplay.addEventListener('click', function(e){
		e.preventDefault();
		openTabSet(e.target.textContent);
	});


	// handle search button
	var searchbutton = document.getElementById('btnSearch');
	searchbutton.addEventListener('click', function(e){
		e.preventDefault();
		var term = document.getElementById('txtSearch').value;
		chrome.runtime.getBackgroundPage(function(bgPage) {});


		//var settingsIdArray = ['cbGoogle', 'cbBing', 'cbYahoo', 'cbDuckDuckGo', 'cbExalead', 'cbGigablast', 'cbFaroo', 'cbQwant', 'cbYandex', 'cbBaidu', 'cbEbay', 'cbAmazon', 'cbAliExpress', 'cbBookmarks', 'cbHistory', 'cbYouTube', 'cbVimeo', 'cbGoogleVideo', 'cbBingVideo', 'cbYahooVideo', 'cbHulu', 'cbWMHT', 'cbVeoh', 'cbBreak', 'cbMetacafe', 'cbDailymotion', 'cbFacebook', 'cbTwitter', 'cbGooglePlus', 'cbFoodie', 'cbYummly', 'cbGoogleRecipes', 'cbMyRecipes', 'cbFood', 'cbCookingChannel', 'cbEatingWell', 'cbBettyCrocker', 'cbHotbot', 'cbDogpile', 'cbWebcrawler', 'cbExcite', 'cbSmugmug', 'cbFlickr', 'cbPhotobucket', 'cbDeviantArt', 'cbImgur'];
		//for(var i=0; i<settingsIdArray.length; i++){
        //
        //
		//	if(document.getElementById(settingsIdArray[i]).checked){
		//		switch(settingsIdArray[i]){
		//			case 'cbGoogle':
		//				//
		//				console.log('cbGoogle ' + term);
		//				var url = 'https://www.google.com/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbBing':
		//				//
		//				console.log('cbBing ' + term);
		//				var url = 'http://www.bing.com/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbYahoo':
		//				//
		//				console.log('cbYahoo ' + term);
		//				var url = 'https://search.yahoo.com/search?p=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbDuckDuckGo':
		//				//
		//				console.log('cbDuckDuckGo ' + term);
		//				var url = 'https://duckduckgo.com/?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbExalead':
		//				//
		//				console.log('cbExalead ' + term);
		//				var url = 'https://www.exalead.com/search/web/results/?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbGigablast':
		//				//
		//				console.log('cbGigablast ' + term);
		//				var url = 'http://www.gigablast.com/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbYandex':
		//				//
		//				console.log('cbYandex ' + term);
		//				var url = 'https://www.yandex.com/yandsearch?text=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbBaidu':
		//				//
		//				console.log('cbBaidu ' + term);
		//				var url = 'http://www.baidu.com/s?wd=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbFaroo':
		//				//
		//				console.log('cbFaroo ' + term);
		//				var url = 'http://www.faroo.com/#q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbQwant':
		//				//
		//				console.log('cbQwant ' + term);
		//				var url = 'https://www.qwant.com/?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
        //
		//			case 'cbEbay':
		//				//
		//				console.log('cbEbay ' + term);
		//				var url = 'http://www.ebay.com/sch/i.html?&_nkw=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbAmazon':
		//				//
		//				console.log('cbAmazon ' + term);
		//				var url = 'http://www.amazon.com/s/field-keywords=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbAliExpress':
		//				//
		//				console.log('cbAliExpress ' + term);
		//				var url = 'http://www.aliexpress.com/wholesale?SearchText=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbBookmarks':
		//				//
		//				console.log('cbBookmarks ' + term);
		//				var url = 'chrome://bookmarks/#q=' + term;
		//				openTab(url);
		//				break;
		//			case 'cbHistory':
		//				//
		//				console.log('cbHistory ' + term);
		//				var url = 'chrome://history/#q=' + term;
		//				openTab(url);
		//				break;
		//			case 'cbYouTube':
		//				//
		//				console.log('cbYouTube ' + term);
		//				var url = 'http://www.youtube.com/results?search_query=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbVimeo':
		//				//
		//				console.log('cbVimeo ' + term);
		//				var url = 'http://vimeo.com/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbGoogleVideo':
		//				//
		//				console.log('cbGoogleVideo ' + term);
		//				var url = 'https://www.google.com/search?num=100&newwindow=1&safe=off&hl=en&tbm=vid&q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbBingVideo':
		//				//
		//				console.log('cbBingVideo ' + term);
		//				var url = 'http://www.bing.com/videos/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbYahooVideo':
		//				//
		//				console.log('cbYahooVideo ' + term);
		//				var url = 'http://video.search.yahoo.com/search/video?p=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbHulu':
		//				//
		//				console.log('cbHulu ' + term);
		//				var url = 'http://www.hulu.com/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbVeoh':
		//				//
		//				console.log('cbVeoh ' + term);
		//				var url = 'http://www.veoh.com/find/?query=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbBreak':
		//				//
		//				console.log('cbBreak ' + term);
		//				var url = 'http://www.break.com/findall/?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbMetacafe':
		//				//
		//				console.log('cbMetacafe ' + term);
		//				var url = 'http://www.metacafe.com/videos_about/' + encodeURIComponent(term) + '/';
		//				openTab(url);
		//				break;
		//			case 'cbDailymotion':
		//				//
		//				console.log('cbDailymotion ' + term);
		//				var url = 'http://www.dailymotion.com/us/relevance/universal/search/' + encodeURIComponent(term) + '';
		//				openTab(url);
		//				break;
        //
		//			case 'cbWMHT':
		//				//
		//				console.log('cbWMHT ' + term);
		//				var url = 'http://video.wmht.org/search/?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbFacebook':
		//				//
		//				console.log('cbFacebook ' + term);
		//				var url = 'https://www.facebook.com/search/str/' + encodeURIComponent(term) + '/keywords_top';
		//				openTab(url);
		//				break;
		//			case 'cbTwitter':
		//				//
		//				console.log('cbTwitter ' + term);
		//				var url = 'https://twitter.com/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbGooglePlus':
		//				//
		//				console.log('cbGooglePlus ' + term);
		//				var url = 'https://plus.google.com/s/' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
        //
		//			case 'cbFoodie':
		//				//
		//				console.log('cbFoodie ' + term);
		//				var url = 'http://www.foodie.com/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbYummly':
		//				//
		//				console.log('cbYummly ' + term);
		//				var url = 'http://www.yummly.com/recipes?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbGoogleRecipes':
		//				//
		//				console.log('cbGoogleRecipes ' + term);
		//				var url = 'https://www.google.com/search?q=' + encodeURIComponent(term) + '&tbs=rcp%3A1';
		//				openTab(url);
		//				break;
		//			case 'cbMyRecipes':
		//				//
		//				console.log('cbMyRecipes ' + term);
		//				var url = 'http://www.myrecipes.com/search/site/' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbFood':
		//				//
		//				console.log('cbFood ' + term);
		//				var url = 'http://www.food.com/search/' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbCookingChannel':
		//				//
		//				console.log('cbCookingChannel ' + term);
		//				var url = 'http://www.cookingchanneltv.com/search-results.html?searchTerm=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbEatingWell':
		//				//
		//				console.log('cbEatingWell ' + term);
		//				var url = 'http://www.eatingwell.com/search/apachesolr_search/' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbBettyCrocker':
		//				//
		//				console.log('cbBettyCrocker ' + term);
		//				var url = 'http://www.bettycrocker.com/search/searchresults?term=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbHotbot':
		//				//
		//				console.log('cbHotbot ' + term);
		//				var url = 'http://www.hotbot.com/search/web?q=' + encodeURIComponent(term) + '&keyvol=01e32e5055bc4ba0f3e4';
		//				openTab(url);
		//				break;
		//			case 'cbDogpile':
		//				//
		//				console.log('cbDogpile ' + term);
		//				var url = 'http://www.dogpile.com/search/web?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbWebcrawler':
		//				//
		//				console.log('cbWebcrawler ' + term);
		//				var url = 'https://www.webcrawler.com/search/web?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbSmugmug':
		//				//
		//				console.log('cbSmugmug ' + term);
		//				var url = 'http://www.smugmug.com/search/?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbFlickr':
		//				//
		//				console.log('cbFlickr ' + term);
		//				var url = 'https://www.flickr.com/search/?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbPhotobucket':
		//				//
		//				console.log('cbPhotobucket ' + term);
		//				var url = 'http://photobucket.com/images/' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbDeviantArt':
		//				//
		//				console.log('cbDeviantArt ' + term);
		//				var url = 'http://www.deviantart.com/browse/all/?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
		//			case 'cbImgur':
		//				//
		//				console.log('cbImgur ' + term);
		//				var url = 'http://imgur.com/search?q=' + encodeURIComponent(term);
		//				openTab(url);
		//				break;
        //
		//		}
		//	}
        //
        //
		//}
	});

	// display links
	chrome.topSites.get(displayTopSites);
	chrome.bookmarks.getRecent(80, displayRecentlyBookmarked);
	getRecentlyVisited();
	initializeNavMenu();
};