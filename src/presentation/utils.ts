const getMillisecondsFromExpiration = (expiration: string): number => {
    const timeValue: number = parseInt(expiration, 10);
    if (expiration.includes('h')) {
        return timeValue * 60 * 60 * 1000;
    }
    if (expiration.includes('d')) {
        return timeValue * 24 * 60 * 60 * 1000;
    }
    return timeValue;
}

export default getMillisecondsFromExpiration;