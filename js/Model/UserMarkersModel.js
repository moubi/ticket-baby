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

return UserMarkersModel;
});