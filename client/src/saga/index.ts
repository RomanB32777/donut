import {all} from "redux-saga/effects"
import { PersonInfoPageWatcher } from "./PersonInfo/PersonInfoPageWatcher"
import { PersonInfoWatcher } from "./PersonInfo/PersonInfoWatcher"
import { SearchWatcher } from "./Search/SearchWatcher"
import { UserWatcher } from "./User/UserWatcher"

export function* rootWatcher() {
    yield all([
        UserWatcher(),
        SearchWatcher(),
        PersonInfoWatcher(),
        PersonInfoPageWatcher(),
    ])
}