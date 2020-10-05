function discordextra_log(label, text) {
    var logText = "%c[" + label + "] %c" + text 
    console.log(logText,"color: #3db1ff;", "color:white;")
}
var hookedSettings = false;
var hookedHideBar = false;
var cfg = {
    bgImage: "",
    discordThemes : [
        {
            "name": "Discord Default",
            "focusedTheme": "inherit",
            "themeData": {
                "teritary": "",
                "secondary": "",
                "secondary-alt": "",
                "interactive-unactive": "",
                "interactive-active": "",
                "channel-text": "",
                "message-date": "",
                "message-color": ""
            }
        },
        {
            "name": "Zen World",
            "focusedTheme": "dark",
            "themeData": {
                "teritary": "",
                "secondary": "",
                "secondary-alt": "",
                "interactive-unactive": "",
                "interactive-active": "",
                "channel-text": "",
                "message-date": "",
                "message-color": ""
            }
        }
    ],
    loadedTheme: {
        "name": "Discord Default",
        "focusedTheme": "inherit",
        "themeData": {
            "teritary": "",
            "secondary": "",
            "secondary-alt": "",
            "interactive-unactive": "",
            "interactive-active": "",
            "channel-text": "",
            "message-date": "",
            "message-color": ""
        }
    },
    wantsHideButton: true
}
chrome.storage.sync.get("cfgData", (data) => {
    discordextra_log("Discord Extra", "Retrieved cfgData")
    if(data.cfgData === undefined) {
        chrome.storage.sync.set({"cfgData": cfg})
    }
    var needsReplacement = false;
    var replacementCFG = {}
    for(key of Object.keys(cfg)) {
        if(!(Object.keys(data.cfgData).includes(key))) {
            needsReplacement = true;
            console.log(key, " had to be replaced")
            replacementCFG[key] = cfg[key]
        } else {
            replacementCFG[key] = data.cfgData[key]
        }
    }
    if(needsReplacement) {
        cfg = replacementCFG
        chrome.storage.sync.set({"cfgData": replacementCFG})
        discordextra_log("Discord Extra", "cfgData has been fixed")
    } else {
        cfg = data.cfgData
        discordextra_log("Discord Extra", "cfgData has been loaded")
    }
})
async function readFile(url) {
    url = chrome.runtime.getURL(url)
    const responseText = fetch(url)
    .then(
        response => response.text()
    )
    .then(obj => {
        return obj;
    })
    return responseText
}

function saveCFG() {
    chrome.storage.sync.set({"cfgData": cfg})
    discordextra_log("Discord Extra", "Saved CFG")
}
function clearSettings () {
    for(div of document.getElementsByClassName("contentColumn-2hrIYH contentColumnDefault-1VQkGM")[0].childNodes) {
        div.className = ""
        div.innerHTML = ""
    }
}

function hookSettingsPage() {
    var bgImage_button = document.getElementById("bgImage")
    var bgImage_text = document.getElementById("bgImageInput")
    var removebgImage_button = document.getElementById("removeBg")
    var minifyButton_setting_button = document.getElementById("minifyButton")
    var minifyButton_setting_check = document.getElementById("minifyButtonCheck")
    if (cfg["wantsHideButton"]) {
        minifyButton_setting_check.className = "flexChild-faoVW3 switchEnabled-V2WDBB switch-3wwwcV valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX"
    } else {
        minifyButton_setting_check.className = "flexChild-faoVW3 switchEnabled-V2WDBB switch-3wwwcV valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX"
    }
    bgImage_button.addEventListener("click", () => {
        cfg["bgImage"] = bgImage_text.value
        chrome.storage.sync.set({
            "cfgData": cfg
        })

        chrome.storage.sync.get("cfgData", (data) => {
            discordextra_log("Discord Extra", "Changed background to " + data.cfgData["bgImage"])
        })
    })
    removebgImage_button.addEventListener("click", () => {
        cfg["bgImage"] = ""
        saveCFG()
        discordextra_log("Discord Extra", "Removed Background Image, Reverted to normal.")
        var chatUI = document.getElementsByClassName("chat-3bRxxu")[0]
        var memberList = document.getElementsByClassName("content-3YMskv")[2]
        var memberHeader = document.getElementsByClassName("membersGroup-v9BXpm")[0]
        var memberContainer = document.getElementsByClassName("members-1998pB")[0]
        chatUI.removeAttribute('style')
        memberList.style.backgroundColor = "rgba(47, 49, 54,1)"
        memberHeader.style.backgroundColor = "rgba(47, 49, 54,1)"
        memberContainer.style.backgroundColor = "rgba(47, 49, 54,1)"
    })
    minifyButton_setting_button.addEventListener("click", () => {
        cfg["wantsHideButton"] = !cfg["wantsHideButton"]
        if (cfg["wantsHideButton"]) {
            minifyButton_setting_check.className = "flexChild-faoVW3 switchEnabled-V2WDBB switch-3wwwcV valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX"
        } else {
            minifyButton_setting_check.className = "flexChild-faoVW3 switchEnabled-V2WDBB switch-3wwwcV valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX"
            document.getElementById("hideBarButton").remove()
        }
        saveCFG()
    })


}
for (theme of cfg["discordThemes"]) {
    var themeButton = document.createElement("button")
    themeButton.className = "savedItem"
    themeButton.innerHTML = theme["name"]
    themeButton.addEventListener("click", () => {
        cfg["loadedTheme"] = theme
    })
    document.getElementById("savedThemes").appendChild(themeButton)
}

function hookAboutPage () {
    var hookGithub = setInterval(() => {
        if(document.getElementById("githubClick") != null) {
            var githubClick = document.getElementById("githubClick")
            githubClick.addEventListener("click", () => {
                window.open('https://github.com/pybash/discordextra')
            })
            clearInterval(hookGithub)
        }
    }, 100);
}

function setHideButtonFunc () {
    if(cfg["wantsHideButton"] && !location.href.includes("@me") && document.getElementsByClassName("children-19S4PO")[0] != null && document.getElementsByClassName("sidebar-2K8pFh")[0] != null  && document.getElementById("hideBarButton") === null) {
        var toolbar = document.getElementsByClassName("children-19S4PO")[0]
        var sidebar = document.getElementsByClassName("sidebar-2K8pFh")[0]
        toolbar.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="22px" height="22px" id="hideBarButton" style="cursor:pointer;" enabledhide="false"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/><path d="M24 24H0V0h24v24z" fill="none"/></svg>' + toolbar.innerHTML
        hookedHideBar = true
        sidebar.style.transition = "width .9s ease-in-out;"
        document.getElementById("hideBarButton").addEventListener("click", () => {
            var sidebar = document.getElementsByClassName("sidebar-2K8pFh")[0]
            sidebar.style.transition = "width .9s ease-in-out;"
            setTimeout(() => {
                if(document.getElementById("hideBarButton").getAttribute("enabledhide") == "false") {
                    document.getElementById("hideBarButton").setAttribute("enabledhide","true")
                    sidebar.style.width = "50px"
                    document.getElementById("hideBarButton").innerHTML = ""
                    document.getElementById("hideBarButton").innerHTML = '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>'

                } else {
                    document.getElementById("hideBarButton").setAttribute("enabledhide","false")
                    sidebar.style.width = null
                    document.getElementById("hideBarButton").innerHTML = ""
                    document.getElementById("hideBarButton").innerHTML = '<path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/><path d="M24 24H0V0h24v24z" fill="none"/>'
                }
            }, 10);
        })
        discordextra_log("Discord Extra", "Applied Hide Sidebar")
    }
}

var setHideButton = setInterval(setHideButtonFunc,100)


if(location.href.split("/")[location.href.split("/").length - 1] != "@me") {
    var getExist = setInterval((e) => {
        if(document.getElementsByClassName("chat-3bRxxu")[0] != null) 
        {
            if(cfg["bgImage"] != "") {
                var chatUI = document.getElementsByClassName("chat-3bRxxu")[0]
                var memberList = document.getElementsByClassName("content-3YMskv")[2]
                var memberHeader = document.getElementsByClassName("membersGroup-v9BXpm")[0]
                var memberContainer = document.getElementsByClassName("members-1998pB")[0]

                chatUI.style.backgroundImage = "linear-gradient(270deg, rgba(44,47,51,0.8) 0%, rgba(44,47,51,0.8) 100%),url('" + cfg["bgImage"] + "'"
                chatUI.style.backgroundSize = "auto"
                chatUI.style.backgroundRepeat = "no-repeat"
                chatUI.style.opacity = "1"
                chatUI.style.backgroundPosition = "center"
                chatUI.style.backgroundAttachment = "fixed"
                memberList.style.backgroundColor = "rgba(47, 49, 54,0)"
                memberHeader.style.backgroundColor = "rgba(47, 49, 54,0)"
                memberContainer.style.backgroundColor = "rgba(47, 49, 54,0.5)"
            }
            // else {
            //     var chatUI = document.getElementsByClassName("chat-3bRxxu")[0]
            //     var memberList = document.getElementsByClassName("content-3YMskv")[2]
            //     var memberHeader = document.getElementsByClassName("membersGroup-v9BXpm")[0]
            //     var memberContainer = document.getElementsByClassName("members-1998pB")[0]
            // }
        }
    },100)
}
var hookSetting = setInterval(() => {
    if(document.getElementsByClassName("button-14-BFJ enabled-2cQ-u7 button-38aScr lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN")[2] != null) {
        hookedSettings = true
        discordextra_log("Discord Extra", "Hooked Settings")
        document.getElementsByClassName("button-14-BFJ enabled-2cQ-u7 button-38aScr lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN")[2].addEventListener("click", () => {
            var madeButtons = false
            var setupButtons = setInterval(() => {
                if(!madeButtons) {
                    function clearSettingsDiv () {
                        document.getElementsByClassName("contentColumn-2hrIYH contentColumnDefault-1VQkGM")[0].childNodes[0].innerHTML = ""
                    }
                    
                    function settingsDiv () {
                        return document.getElementsByClassName("contentColumn-2hrIYH contentColumnDefault-1VQkGM")[0].childNodes[0]
                    }
                    
                    function createElementOnSidebar (elementObject) {
                        var sideBar = document.getElementsByClassName("side-8zPYf6")[0]
                        sideBar.insertBefore(elementObject, sideBar.childNodes[sideBar.childNodes.length - 2])
                    }
                    function createSideButton (name,buttonFunc) {
                        var sideBar = document.getElementsByClassName("side-8zPYf6")[0]
                        var button = document.createElement("div")
                        button.className=  "item-PXvHYJ themed-OHr7kt"
                        button.role = "button"
                        button.tabIndex = 0
                        button.addEventListener("click", buttonFunc)
                        button.innerHTML = name
                        createElementOnSidebar(button)
                    }
                    
                    var sideBar = document.getElementsByClassName("side-8zPYf6")[0]
                    var sep1 = document.createElement('div')
                    var discordex_settings_header = document.createElement("div")
                    sep1.className = "separator-gCa7yv"
                    discordex_settings_header.innerHTML = "discord extra settings"
                    discordex_settings_header.className = "header-2RyJ0Y"
                    discordex_settings_header.role = "button"
                    discordex_settings_header.tabIndex = 0
                    createElementOnSidebar(discordex_settings_header)
                    createSideButton("Settings", () => {
                        clearSettings()
                        readFile("pages/settings.html").then((data) => {
                            document.getElementsByClassName("contentColumn-2hrIYH contentColumnDefault-1VQkGM")[0].childNodes[0].innerHTML = data
                            hookSettingsPage()
                        })
                    })
                    createSideButton("GitHub", () => {
                        clearSettings()
                        readFile("pages/github.html").then((data) => {
                            document.getElementsByClassName("contentColumn-2hrIYH contentColumnDefault-1VQkGM")[0].childNodes[0].innerHTML = data
                        })
                        hookAboutPage()
                    })
                    createElementOnSidebar(sep1)
                    if(sideBar != null) {
                        madeButtons = true;
                        clearInterval(setupButtons)
                    }
                }
            },100)
        })
        clearInterval(hookSetting);
    }
},100)

function loadTheme() {
    // "name": "Discord Default",
    // "focusedTheme": "inherit",
    // "themeData": {
    //     "teritary": "",
    //     "secondary": "",
    //     "secondary-alt": "",
    //     "interactive-unactive": "",
    //     "interactive-active": "",
    //     "channel-text": "",
    //     "message-date": "",
    //     "message-color": ""
    // }
    switch (cfg["loadedTheme"]["focusedTheme"]) {
        case "dark":
            for(elem of document.getElementsByClassName("theme-light")) { elem.className = elem.className.replace("theme-light", "theme-dark")};
            break;
        case "light":
            for(elem of document.getElementsByClassName("theme-dark")) { elem.className = elem.className.replace("theme-dark", "theme-light")};
        default:
            break;
    }
    for(key in Object.keys(cfg["loadedTheme"]["themeData"])) {
        if(cfg["loadedTheme"]["themeData"][key] != "") {
            switch(key) {
                case "teitary":
                    document.getElementsByTagName("html")[0].style.setProperty("--background-tertiary", cfg["loadedTheme"]["themeData"][key]);
                    break;
                case "secondary":
                    document.getElementsByTagName("html")[0].style.setProperty("--background-secondary", cfg["loadedTheme"]["themeData"][key]);
                    break;
                case "secondary-alt":
                    document.getElementsByTagName("html")[0].style.setProperty("--background-secondary-alt", cfg["loadedTheme"]["themeData"][key]);
                    break;
                case "interactive-unactive":
                    document.getElementsByTagName("html")[0].style.setProperty("--background-secondary", cfg["loadedTheme"]["themeData"][key]);
                    break;
                case "secondary":
                    document.getElementsByTagName("html")[0].style.setProperty("--background-secondary", cfg["loadedTheme"]["themeData"][key]);
                    break;
                case "secondary":
                    document.getElementsByTagName("html")[0].style.setProperty("--background-secondary", cfg["loadedTheme"]["themeData"][key]);
                    break;
                case "secondary":
                    document.getElementsByTagName("html")[0].style.setProperty("--background-secondary", cfg["loadedTheme"]["themeData"][key]);
                    break;
                case "secondary":
                    document.getElementsByTagName("html")[0].style.setProperty("--background-secondary", cfg["loadedTheme"]["themeData"][key]);
                    break;
            }
        }
    }
}

// function clearSettingsDiv () {
//     document.getElementsByClassName("contentColumn-2hrIYH contentColumnDefault-1VQkGM")[0].childNodes[0].innerHTML = ""
// }

// function settingsDiv () {
//     return document.getElementsByClassName("contentColumn-2hrIYH contentColumnDefault-1VQkGM")[0].childNodes[0]
// }

// function createElementOnSidebar (elementObject) {
//     var sideBar = document.getElementsByClassName("side-8zPYf6")[0]
//     sideBar.insertBefore(elementObject, sideBar.childNodes[sideBar.childNodes.length - 2])
// }
// function createSideButton (name,buttonFunc) {
//     var sideBar = document.getElementsByClassName("side-8zPYf6")[0]
//     var button = document.createElement("div")
//     button.className=  "item-PXvHYJ themed-OHr7kt"
//     button.role = "button"
//     button.tabIndex = 0
//     button.addEventListener("click", buttonFunc)
//     button.innerHTML = name
//     createElementOnSidebar(button)
// }

// var sideBar = document.getElementsByClassName("side-8zPYf6")[0]
// var sep1 = document.createElement('div')
// var discordex_settings_header = document.createElement("div")
// sep1.className = "separator-gCa7yv"
// discordex_settings_header.innerHTML = "discord extra settings"
// discordex_settings_header.className = "header-2RyJ0Y"
// discordex_settings_header.role = "button"
// discordex_settings_header.tabIndex = 0
// createElementOnSidebar(discordex_settings_header)
// createSideButton("Settings", () => {
//     xhr = new XMLHttpRequest();
//     xhr.onload = (xhrResponse) => {
//         console.log(xhrResponse.responseText)
//     }
//     xhr.open("GET", "pages/settings.html", true);
//     xhr.send();

// })
// createElementOnSidebar(sep1)