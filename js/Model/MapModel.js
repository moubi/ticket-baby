N.plug("MapModel", function() {
N.extend(MapModel, N.plugins.Model);

MapModel.TABLE = "map";
function MapModel() {
	this.MapModel();
}
MapModel.prototype.MapModel = function() {
	this.Model();
	this.store(MapModel.TABLE);
};
MapModel.prototype.data = [
	{
		id : "3cbe42c7-9cee-4265-a4cd-5d8bd7007339", 
		center : [40.7140, -73.9799], // New York
		zoom : 14, 
		tileURI : "http://{s}.tile.cloudmade.com/03e387babe814130b639cb93c1f16cbf/997/256/{z}/{x}/{y}.png", 
		attribution : 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	    maxZoom : 18, 
	    zoomControl : false
	}
];

return MapModel;
});