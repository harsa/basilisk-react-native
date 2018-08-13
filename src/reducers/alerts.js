import {
	ALERT_CHANGED, ALERT_DELETE,
	ALERT_EDIT,
	ALERT_FIELD_CHANGE,
	ALERT_NEW,
	ALERT_RECEIVE,
	ALERT_RULE_FIELD_CHANGE, ALERT_SAVE,
} from "../actions/actionTypes";
import update from "immutability-helper";
const initialState = {
  alerts: {},
  currentAlert: null
};
const newAlert = {
  name: "",
  message: "",
  value: 10,
  alertId: null,
  triggered: null,
  notificationsEnabled: true,
  rules: {
  	rule1: {
			deviceName: "",
			sensorId: "",
			threshold: "",
			kind: "",
			value: ""
		}
	}

};
const newRule = {};
export default (state = initialState, action) => {
  switch (action.type) {
    case ALERT_SAVE:
			return update(state, {
				currentAlert: {$set: null}
			})
    case ALERT_DELETE:
      return update(state, {
        alerts: {$unset: [action.alertId]},
        currentAlert: {$set: null}
      })
    case ALERT_RECEIVE:
      return update(state, {
        alerts: { [action.alertId]: { $set: Object.assign({rules: {}}, action.payload) } }
      });
    case ALERT_NEW:
      return update(state, { currentAlert: { $set: newAlert } });
    case ALERT_EDIT:
      return update(state, {
        currentAlert: { $set: state.alerts[action.alertId] }
      });
    case ALERT_FIELD_CHANGE:
      return update(state, {
        currentAlert: { [action.fieldName]: { $set: action.value } }
      });
    case ALERT_RULE_FIELD_CHANGE:
      return update(state, {
        currentAlert: {
          rules: {
            [action.ruleId]: {
              [action.fieldName]: { $set: action.value }
            }
          }
        }
      });
  }

  return state;
};
