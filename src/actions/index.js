import {
	ALERT_CHANGED, ALERT_DELETE,
	ALERT_EDIT,
	ALERT_FIELD_CHANGE,
	ALERT_NEW,
	ALERT_RECEIVE,
	ALERT_RULE_FIELD_CHANGE,
	ALERT_RULE_SAVE,
	ALERT_SAVE,
	DEVICE_CHANGED, DEVICE_HISTORY_RECEIVED,
	DEVICE_READINGS_CHANGED,
	DEVICE_SETTINGS_CHANGED,
	INIT_FIREBASE,
	USER_RECEIVE,
} from "./actionTypes";
import store from "../store/configureStore";
import firebase from "react-native-firebase";
export function deviceChanged(dispatch, method, status, payload) {
  return {
    type: DEVICE_CHANGED,
    method, //on, once, set
    status, //start, success, error,
    payload
  };
}
export function deviceSettingsChanged(deviceId, p) {
	return dispatch => {

		const payload = Object.assign({
			temp: {
				min: 0,
				max: 100
			},
			humidity: {
				min: 0,
				max: 100
			}
		}, p)
		console.log("DEVICE_SETTINGS_CHANGED", payload)

		dispatch({
			type: DEVICE_SETTINGS_CHANGED,
			deviceId,
			payload
		})
	}

}
export function deviceReadingsChanged(deviceId, p) {
	const payload = Object.assign({
		timestamp: p.lastTimestamp
																},p, {

	})
	delete payload.lastTimestamp
  return {
    type: DEVICE_READINGS_CHANGED,
    deviceId,
    payload
  };
}
export function alertChanged(alertId, payload) {
  return {
    type: ALERT_CHANGED,
    alertId,
    payload
  };
}

export function userReceive(payload) {
  console.log("received payload", payload);
  return {
    type: USER_RECEIVE,
    payload
  };
}
export function alertEdit(alertId) {
  return {
    type: ALERT_EDIT,
    alertId
  };
}
export function alertNew() {
  return {
    type: ALERT_NEW
  };
}
export function alertReceive(alertId, payload) {
  return {
    type: ALERT_RECEIVE,
    alertId,
    payload
  };
}
export function alertFieldChange(fieldName, value) {
  return {
    type: ALERT_FIELD_CHANGE,
    fieldName,
    value
  };
}
export function alertRuleFieldChange(ruleId, fieldName, value) {
  return {
    type: ALERT_RULE_FIELD_CHANGE,
    ruleId,
    fieldName,
    value
  };
}
export function alertDelete(){

  const state = store.getState();
	const currentUser = state.user.user;
	const currentAlert = state.alerts.currentAlert;
	const alertId = state.alerts.currentAlert.id

	return dispatch => {
		return firebase
			.database()
			.ref("alerts/" + currentUser.uid + "/" + alertId)
			.remove()
			.then(e => {
				console.log("deleting alert done", e);
				dispatch({
									 type: ALERT_DELETE,
									 alertId,
								 });
				//return currentAlert
			});
	};

}

export function alertSave() {
	const state = store.getState();
  const currentUser = state.user.user;
  const currentAlert = state.alerts.currentAlert;

  const alertId = state.alerts.currentAlert.id
  const payload = state.alerts.currentAlert

  if (alertId){
		return dispatch => {
			return firebase
				.database()
				.ref("alerts/" + currentUser.uid + "/" + alertId)
				.set(currentAlert)
				.then(e => {
					console.log("saving alert done", e);
					dispatch({
										 type: ALERT_SAVE,
										 alertId,
										 payload: currentAlert
									 });
					//return currentAlert
				});
		};
  } else {
		return dispatch => {
			return firebase
				.database()
				.ref("alerts/" + currentUser.uid)
				.push(currentAlert)
				.then(e => {
					console.log("saving  new alert done", e);
					dispatch({
										 type: ALERT_SAVE,
										 alertId,
										 payload: currentAlert
									 });
					//return currentAlert
				});
		};
  }

  console.log("saving alert", payload, currentUser);

}
export function alertRuleSave(alertId, ruleId) {

  return dispatch => {
		const payload = store.getState().alerts.currentAlert.rules[ruleId];
		const currentUser = store.getState().user.user

		console.log("alertRuleSave", alertId, ruleId, payload.value)
		const rule = {
			deviceId: payload.deviceId,
			deviceName: payload.deviceName,
			id: payload.id,
			kind: payload.kind,
			operation: payload.operation,
			threshold: payload.threshold,
			triggered: payload.triggered,
			value: payload.value
		};
    return firebase
      .database()
      .ref("alerts/" + currentUser.uid + "/" + alertId + "/rules/" + ruleId)
      .set(rule)
      .then(() => {
      	console.log("rule saved", rule)
        dispatch({
          type: ALERT_RULE_SAVE,
          ruleId
        });
      });
  };
}

export function fetchHistory(store, token){
	return dispatch => {
		fetch('https://us-central1-basiliskkk.cloudfunctions.net/api/getReportData', {
			headers: {
				"content-type": "application/json",
				Authorization: "Bearer " + token
			}
		}).then(res => res.json()).then(data => {

			const payload = {};
			data.map(d => {
				if (!payload[d.deviceId]){
					payload[d.deviceId] = []
				}
				payload[d.deviceId].push(d)
			})

			let sortedPayload = {}

			Object.keys(payload).map(deviceId => {
				let readings = payload[deviceId].sort((a,b)=>{
					const res = a.timestamp > b.timestamp;
					//console.log("sort2", res)
					return res;
				});
				sortedPayload[deviceId] = readings
			})

			//console.log("fetching history", payload, sortedPayload)
			dispatch({
				type: DEVICE_HISTORY_RECEIVED,
				payload: sortedPayload
			})

		})

	}
}
//adds initial and any new data
export function initFirebase(store) {
  store.subscribe((e, a) => {
    console.log("stuff happened", e, a);
  });
  return dispatch => {
    const currentUser = store.getState().user.user;
    console.log("initing firebase", currentUser);
    if (!currentUser) {
      firebase.auth().onAuthStateChanged(user => {

        if (user) {
					console.log("authStateChanged", user);
					dispatch(userReceive(user));

					user.getIdToken().then((token)=>{
						console.log("fetching history2", token)
						dispatch(fetchHistory(store, token))
					})

					const saveFcmToken = firebase.messaging().getToken().then(token => {
						return firebase.database().ref('users/' + user.uid + '/notificationTokens').child(token).set(Math.round(new Date().getTime() / 1000))
					});


					saveFcmToken.then(()=>{
						//console.warn("token saved", token)
					})
          console.log(
            "init firebase with user",
            user.email,
            initFirebase,
            this
          );
          //setTimeout(initFirebase, 1000)
          dispatch(initFirebase(store));

        } else {

        	firebase.messaging().getToken().then(token => {
						return firebase.database().ref('users/' + user.uid + '/notificationTokens').child(token).set(null)
					}).then(()=>{
						console.log("user logged out, removing fcm token", token)
					})

          //this.props.navigation.navigate("Login");
        }
      });
      return;
    }

    console.log("proceeding with firebase init");

    const db = firebase.database();

    db.ref("deviceSettings/" + currentUser.uid).on("child_added", snap => {
      const settings = snap.val();
      const deviceId = snap.key;
      console.log("got settings", settings);
      dispatch(deviceSettingsChanged(deviceId, settings));
      //update(state, { sensorSettings: { [deviceId]: { $set: settings } } })

      db.ref("devices/" + deviceId).on("value", snap => {
        let readings = snap.val();
        console.log("got device readings", deviceId);
        dispatch(deviceReadingsChanged(deviceId, readings));
        /*
				this.setState(state =>
												update(state, { sensorData: { [deviceId]: { $set: deviceValues } } })
				);
				*/
      });
    });

    db.ref("alerts/" + currentUser.uid).on("child_added", snap => {
      const alertKey = snap.key;
      const alert = snap.val();
      console.log("alert added", alert);
      dispatch(alertReceive(alertKey, alert));
    });

    db.ref("alerts/" + currentUser.uid).on("child_changed", snap => {
      const alertKey = snap.key;
      const alert = snap.val();
      console.log("alert added", alert);
      dispatch(alertReceive(alertKey, alert));
    });

    return {
      type: INIT_FIREBASE
    };
  };
  //load initial data
}
