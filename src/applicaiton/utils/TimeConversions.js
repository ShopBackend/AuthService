const getSecondsFromExpiration = (expiration) => {
    const timeValue = parseInt(expiration, 10);

    if (expiration.includes('d')) 
        return timeValue * 24 * 60 * 60;
    
    if (expiration.includes('h')) 
        return timeValue * 60 * 60;
    
    if (expiration.includes('m')) 
        return timeValue * 60;
    
    return timeValue;
}

export default getSecondsFromExpiration;
