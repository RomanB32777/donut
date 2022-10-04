import { all } from "redux-saga/effects"
import { UserWatcher } from "./User/UserWatcher"

export function* rootWatcher() {
    yield all([
        UserWatcher(),
    ])
}