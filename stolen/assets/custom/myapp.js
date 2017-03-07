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

function initAlbumDetail(id){

    $.getJSON("http://localhost:8000/api/v2/pages/"+id+"/?format=json", function (page_data) {
      /*  var template = $('#template-albumdetail').html();
        var rendered = Mustache.render(template, page_data);
        $('#albumdetail').html(rendered);
	*/
		$('#albumtitle').text(page_data.title);
		$('#bodynothidden').text(page_data.body);
		$('#bodyhidden').text(page_data.body_cacher);
		$('#nextbutton').attr('href','album-detail.html?code='+id+'&way=next');
		$('#prevbutton').attr('href','album-detail.html?code='+id+'&way=prev');
		$('#downnextbutton').attr('href','album-detail.html?code='+id+'&way=next');
		$('#downprevbutton').attr('href','album-detail.html?code='+id+'&way=prev');

		for (var key in page_data.photos){
			var template = $('#template-albumdetail').html();
        	var rendered = Mustache.render(template, page_data.photos[key]);
        	$('#gallery').append(rendered);

		}
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

function initQuad(){
    var quadpageids = [];
    var quad = 0 ;
    $.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (data) {
        
        for (var key in data.items){
            if (data.items[key].meta.type == "langevin_photo.QuadPage"){
                quadpageids.push(data.items[key].id);
            }
        }
        quadpageids.sort(function(a,b){
            return b-a;
        });
        for (var id in quadpageids){
            quad = quadpageids[id];
            break;
        }

        $.getJSON("http://localhost:8000/api/v2/pages/"+quad+"/?format=json", function (page_data) {
        	page_data.pdf.meta.download_url = page_data.pdf.meta.download_url.replace('localhost','localhost:8000');
            var template = $('#template-quad').html();
            var rendered = Mustache.render(template, page_data);
            $('#quad').html(rendered);

            $('#quadtitle').text(page_data.title)

			for (var key in page_data.quadphotos){
				var template = $('#template-albumdetail').html();
        		var rendered = Mustache.render(template, page_data.quadphotos[key]);
        		$('#gallery').append(rendered);

			}

        });

    });
}



function closestHigh(arr, closestTo){
    var closest = Math.max.apply(null, arr); //Get the highest number in arr in case it match nothing.
    for(var i = 0; i < arr.length; i++){ //Loop the array
        if(arr[i] > closestTo && arr[i] < closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
    }
    return closest; // return the value
}

function closestDown(arr, closestTo){
    var closest = Math.min.apply(null, arr); //Get the smallest number in arr in case it match nothing.
    for(var i = 0; i < arr.length; i++){ //Loop the array
        if(arr[i] < closestTo && arr[i] > closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
    }
    return closest; // return the value
}


function nextAlbum(currentid, way){
	console.log("NEXT");
    $.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (pages) {
    	var albums = [];
    	for (var key in pages.items){
            if (pages.items[key].meta.type == "langevin_photo.AlbumPage"){
                albums.push(pages.items[key].id);
            }
        }
        if (way == 'next'){
        	var next = closestHigh(albums, currentid);
        	initAlbumDetail(next);
        }
        if (way == 'prev'){
        	var prev = closestDown(albums, currentid);
        	initAlbumDetail(prev);
        }
    });
}