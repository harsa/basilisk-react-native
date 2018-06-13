const mapStateToProps = (state) => {
	//console.log("mapping state to props", state)
	return {
		devices: state.devices,
		alerts: state.alerts,
		user: state.user
	}
};
export default mapStateToProps