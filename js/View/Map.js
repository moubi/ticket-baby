N.plug("Map", function() {
N.objectMerge(Map.prototype, L);

function Map(element, data) {
	if (typeof data === "object") {
		this.map = new this.Map(element, { center : data.center, zoom : data.zoom, zoomControl : data.zoomControl });
		this.tileLayer(data.tileURI, { attribution: data.attribution, maxZoom : data.maxZoom || 18 }).addTo(this.map);
	}
}
Map.prototype.addMarker = function(data) {
	if (typeof data === "object") {
		var marker = this.icon({ iconUrl : data.iconUrl, iconSize : data.iconSize, iconAnchor : data.iconAnchor, popupAnchor : data.popupAnchor });
		marker = this.marker(data.latlng, { icon : marker, draggable : true }).addTo(this.map);
		
		return marker;
	}
};
Map.prototype.addPopup = function(content, on, position) {
	var popup = this.popup().setContent(content);
	on ? on.bindPopup(popup).openPopup() : popup.setLatLng(data.position).addTo(this.map).openOn(this.map);
	return popup;
};
Map.prototype.removePopup = function(popup) {
	this.map.removeLayer(popup);
};
Map.prototype.removeMarker = function(popup) {
	this.map.removeLayer(popup);
};
Map.prototype.openPopup = function(popup) {
	this.map.openPopup(popup);
};
Map.prototype.closePopup = function(popup) {
	this.map.closePopup(popup);
};

return Map;
});