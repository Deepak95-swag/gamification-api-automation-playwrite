// Get current time in IST (UTC+5:30) formatted as DD-MM-YYYY HH:MM:SS
function getFormattedISTTime(): string {
    const now = new Date();
    // Add 5 hours and 30 minutes to UTC to get IST
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));

    const day = istTime.getDate().toString().padStart(2, '0');
    const month = (istTime.getMonth() + 1).toString().padStart(2, '0');
    const year = istTime.getFullYear();
    const hours = istTime.getHours().toString().padStart(2, '0');

    return `${day}-${month}-${year}-${hours}`;
}

export function makeRandomSuffix(): string {
    return `${getFormattedISTTime()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default makeRandomSuffix;
