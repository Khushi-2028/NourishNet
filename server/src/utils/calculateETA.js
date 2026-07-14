const calculateETA = (seconds) => {

    if (!seconds || seconds < 0) {
        return "0 min";
    }

    const totalMinutes = Math.ceil(seconds / 60);

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes} min`;
    }

    return `${hours} hr ${minutes} min`;

};

export default calculateETA;