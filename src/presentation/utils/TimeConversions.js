const getMillisecondsFromExpiration = (expiration) => {
    const timeValue = parseInt(expiration, 10);
    if (expiration.includes('d'))
        return timeValue * 24 * 60 * 60 * 1000;
    
    if (expiration.includes('h'))
        return timeValue * 60 * 60 * 1000;

    if (expiration.includes('m'))
        return timeValue * 60 * 1000;
    return timeValue;
}

export default getMillisecondsFromExpiration;