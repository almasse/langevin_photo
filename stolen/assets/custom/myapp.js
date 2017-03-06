var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};



function initAlbumList(){

	
	// all
    $.getJSON("http://localhost:8000/api/v2/pages/10/?format=json", function (page_data) {
        var template = $('#template-title').html();
        var rendered = Mustache.render(template, page_data);
        $('#templatetitle').html(rendered);
        $('#backgroundimage').css("background-image", "url(http://localhost:8000"+page_data.photo_url+")");

        //ajout filters menu
		for (var car in page_data.categories){
			var filter = $('<a href="#" data-filter=".'+page_data.categories[car].nom_categorie.toLowerCase()+'">'+page_data.categories[car].nom_categorie+'</a>');
			filter.appendTo('#isotope-filter-collapse');
		}
	
		//gets albums list
    	$.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (pages) {
    		var albums = [];
    		for (var key in pages.items){
            	if (pages.items[key].meta.type == "langevin_photo.AlbumPage"){
                	albums.push(pages.items[key].id);
            	}
        	}

        	//render pictures list
        	for (var ids in albums){
            	$.getJSON("http://localhost:8000/api/v2/pages/"+albums[ids]+"/?format=json", function(page){
                	var template = $('#template-albums-list').html();
                	var rendered = Mustache.render(template, page);
                	$('#albums-list').append(rendered);


                	//link images
                	for (var photo in page.photos){
                		$('#photoid'+page.id).attr("src","http://localhost:8000"+page.photos[photo].photo_url);
                		break;
                	}

                	//ajout categorie in album class
                	for (var check in page_data.categories){
                		if (page.categorie.id == page_data.categories[check].id){
                			$('#item-album'+page.id).addClass(page_data.categories[check].nom_categorie.toLowerCase());
                			break;
                		}
                	}
            	});
        	}
    	});
    });
}


function initIndex(){
    $.getJSON("http://localhost:8000/api/v2/pages/3/?format=json", function (page_data) {
        
        var template = $('#template-presentation').html();
        var rendered = Mustache.render(template, page_data);
        $('#presentation').html(rendered);
        $('#intro-section').css("background-image", "url(http://localhost:8000"+page_data.photo_background_url+")");

    });

}


function initAbout(){
    var aboutpageids = [];
    var about = 0 ;
    $.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (data) {
        
        for (var key in data.items){
            if (data.items[key].meta.type == "langevin_photo.AboutPage"){
                aboutpageids.push(data.items[key].id);
            }
        }
        aboutpageids.sort(function(a,b){
            return b-a;
        });
        for (var id in aboutpageids){
            about = aboutpageids[id];
            break;
        }

        $.getJSON("http://localhost:8000/api/v2/pages/"+about+"/?format=json", function (page_data) {

            var template = $('#template-about').html();
            var rendered = Mustache.render(template, page_data);
        
            $('#about').html(rendered);
            $('#abouttitle').text(page_data.title)

        });

    });
}

