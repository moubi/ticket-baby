N.plug("MarkerModel", function() {
N.extend(MarkerModel, N.plugins.Model);

MarkerModel.TABLE = "markers";
function MarkerModel() {
	this.MarkerModel();
}
MarkerModel.prototype.MarkerModel = function() {
	this.Model();
	this.store(MarkerModel.TABLE);
};
MarkerModel.prototype.data = [
	{
		id : "3cbe42c7-9cee-4265-a4cd-5d8bd7007339", 
		type : "speed_trap", 
		name : "Speed trap", 
		iconUrl : "img/police.png", 
		iconSize : [32, 37], 
		iconAnchor : [16, 37], 
		popupAnchor : [0, -40], 
		draggable : true
	}
];
MarkerModel.prototype.marker = function(id) {
	return this.select(function(row) { return row.id === id; })[0];
};

return MarkerModel;
});