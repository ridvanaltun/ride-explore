//
// Reducer...
//

export default reducer = (state = initialState, action) => {
    switch(action.type) {

        case "setSocketID":
            return { ...state, socketID: action.value };

        case "setIsServerConnectionOk":
            return { ...state, isServerConnectionOk: action.value };

        case "setLocation":
            return { ...state, location: action.value };

        case "setPersonData":
            return { ...state, personData: action.value };

        case "setMapRegion":
            return { ...state, mapRegion: action.value };

        case "setPermissionStatus":
            return { ...state, permissionStatus: action.value };

        case "setServiceStatus":
            return { ...state, serviceStatus: action.value };

        case "setIsAppOnForeground":
            return { ...state, isAppOnForeground: action.value };

        case "setOnlineUserList":
            return { ...state, onlineUserList: action.value };

        case "setFollowedUserList":
            return { ...state, followedUserList: action.value };

        case "appendItemFollowedUserList":
            return { ...state, followedUserList: [ ...state.followedUserList, action.value] };

        case "setBlockedUserList":
            return { ...state, blockedUserList: action.value };

        case "setApplyMapRegion":
            return { ...state, applyMapRegion: action.value };

        case "setIsLoading":
            return { ...state, isLoading: action.value };

        default:
            return state;
    }
};

//
// Action Creators...
//

const setSocketID = (socketID) => {
    return {
        type: "setSocketID",
        value: socketID,
    };
}

const setIsServerConnectionOk = (isServerConnectionOk) => {
    return {
        type: "setIsServerConnectionOk",
        value: isServerConnectionOk,
    };
}

const setLocation = (location) => {
    return {
        type: "setLocation",
        value: location,
    };
}

const setIsAppOnForeground = (isAppOnForeground) => {
    return {
        type: "setIsAppOnForeground",
        value: isAppOnForeground,
    };
}

const setMapRegion = (mapRegion) => {
    return {
        type: "setMapRegion",
        value: mapRegion,
    };
}

const setPermissionStatus = (permissionStatus) => {
    return {
        type: "setPermissionStatus",
        value: permissionStatus
    };
}

const setServiceStatus = (serviceStatus) => {
    return {
        type: "setServiceStatus",
        value: serviceStatus
    };
}

const setPersonData = (personData) => {
    return {
        type: "setPersonData",
        value: personData
    };
}

const setOnlineUserList = (onlineUserList) => {
    return {
        type: "setOnlineUserList",
        value: onlineUserList
    };
}

const setFollowedUserList = (followedUserList) => {
    return {
        type: "setFollowedUserList",
        value: followedUserList
    };
}

const appendItemFollowedUserList = (followedUserList) => {
    return {
        type: "appendItemFollowedUserList",
        value: followedUserList
    };
}

const setBlockedUserList = (blockedUserList) => {
    return {
        type: "setBlockedUserList",
        value: blockedUserList
    };
}

const setApplyMapRegion = (applyMapRegion) => {
    return {
        type: "setApplyMapRegion",
        value: applyMapRegion
    };
}

const setIsLoading = (isLoading) => {
    return {
        type: "setIsLoading",
        value: isLoading
    };
}

export {
    setSocketID,
    setIsAppOnForeground,
    setLocation,
    setPermissionStatus,
    setServiceStatus,
    setMapRegion,
    setIsServerConnectionOk,
    setPersonData,
    setOnlineUserList,
    setFollowedUserList,
    appendItemFollowedUserList,
    setBlockedUserList,
    setApplyMapRegion,
    setIsLoading
};
