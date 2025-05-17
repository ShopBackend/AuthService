function setCookie(res, name, value, maxAge, isSecure = true) {
    res.cookie(name, value, {
        httpOnly: true,
        secure: isSecure,
        maxAge,
        sameSite: 'Lax'
    });
};

function clearCookie(res, name, isSecure = true) {
    res.clearCookie(name, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'Lax'
    });
};

export { setCookie, clearCookie }