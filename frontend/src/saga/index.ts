import {all} from "redux-saga/effects"
import { GoalsWatcher } from "./Goals/GoalsWatcher"
import { NotificationsWatcher } from "./Notifications/NotificationsWatcher"
import { PersonInfoWatcher } from "./PersonInfo/PersonInfoWatcher"
import { StatsWatcher } from "./Stats/StatsWatcher"
import { UserWatcher } from "./User/UserWatcher"

export function* rootWatcher() {
    yield all([
        UserWatcher(),
        PersonInfoWatcher(),
        NotificationsWatcher(),
        GoalsWatcher(),
        StatsWatcher(),
    ])
}