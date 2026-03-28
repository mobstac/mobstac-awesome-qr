export const getFrameTextSize = (configSize: number, textLength: number) => {
    let factor;

    if (textLength >= 0 && textLength <= 12) {
        factor = 10;
    } else if (textLength <= 16) {
        factor = 13;
    } else if (textLength <= 20) {
        factor = 16;
    } else if (textLength <= 24) {
        factor = 17;
    }  else if (textLength <= 27) {
        factor = 19;
    } else if (textLength <= 30) {
        factor = 20;
    } else {
        throw new Error('Frame text should be between 0 to 30 characters')
    }
    return configSize / factor;
};

export const getLengthOfLongestText = (text: string | undefined) => {
    const textLineMaxLength = text ? text.split('\n').map(value => value.trim())
                .reduce((max, line) => Math.max(max, line.length), 0) : 7;

    return textLineMaxLength;
}