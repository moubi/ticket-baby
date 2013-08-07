N.plug("UserMarkersModel", function() {
N.extend(UserMarkersModel, N.plugins.Model);

UserMarkersModel.TABLE = "user_markers";
UserMarkersModel.FIELDS = { id : "required", mid : "required", uid : "required", date : "required", latlng : "required", status : "optional" };
UserMarkersModel.STATUS = { active : "active", declined : "declined", pending : "pending" };
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

return UserMarkersModel;
});