/**
 * Created by Owner on 2/16/2017.
 */


$( document ).ready(function() {
    var objQueryInfo = {
        windowType: "normal"
    };
    chrome.tabs.query(objQueryInfo, function(tabArray){
        console.log(tabArray);



        $("ul.openurllist").html(function(){
            let rethtml = "";
            $.each(tabArray, function(index,obj){
                rethtml += `<li>
                    <input type="checkbox" name="${obj.title}" id="${obj.title}" checked>
                    <label for="cbGoogle">${obj.title}</label>
                </li>`
            });
            return rethtml;
        });
    });

});