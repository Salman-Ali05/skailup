export const avoidDoubleClicks = (idEl) => {
    document.getElementById(idEl).classList.add("disabled");
    setTimeout(() => {
        document.getElementById(idEl).classList.remove("disabled");
    }, 1000);
}
