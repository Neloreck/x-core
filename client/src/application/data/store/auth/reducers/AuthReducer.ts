import {TestAction} from "@Store/auth/actions/TestAction";
import {AuthState} from "@Store/auth/store/AuthState";

import {ActionHandler, ReflectiveReducer} from "redux-cbd";

export class AuthReducer extends ReflectiveReducer<AuthState> {

}
