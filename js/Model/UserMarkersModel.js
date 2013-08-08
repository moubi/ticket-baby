N.plug("UserMarkersModel", function() {
N.extend(UserMarkersModel, N.plugins.Model);

UserMarkersModel.TABLE = "user_markers";
UserMarkersModel.FIELDS = { id : "required", mid : "required", uid : "required", date : "required", latlng : "required", status : "optional" };
UserMarkersModel.STATUS = { active : "active", declined : "declined", pending : "pending" };

var MARKERS_DAILY_LIMIT = 3;
function UserMarkersModel() {
	this.UserMarkersModel();
}
UserMarkersModel.prototype.UserMarkersModel = function() {
	this.Model();
};
UserMarkersModel.prototype.markerOwnedByUser = function(mid, uid) {
	return this.select(function(row) { return row.id === mid; })[0].uid === uid;
};
UserMarkersModel.prototype.markerOwner = function(mid) {
	var marker = this.select(function(row) { return row.id === mid; })[0];
	return marker ? N.objectMerge(this.select(function(row) { return row.id === marker.uid; }, "users")[0], marker) : null;
};
UserMarkersModel.prototype.isNewMarkerAllowed = function(uid) {
	var currentDate = new Date(); 
		markers = this.select(function(row) { 
		return _compareDates(new Date(Date.parse(row.date)), currentDate);
	});
	return (markers.length < MARKERS_DAILY_LIMIT) ? true : false;
};

function _compareDates(date1, date2) {
	date1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
	date2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
	return ((Math.abs(date1 - date2))/1000/60/60/24 >= 1) ? false : true;
}

return UserMarkersModel;
});