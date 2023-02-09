/* global document */

export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

 export const loadImage = (src: string, imageServerURL?: string | undefined | RequestInfo, imageServerRequestHeaders?: object | undefined) => {
    // @ts-ignore
    imageServerRequestHeaders['Content-type'] = 'application/json'
    return new Promise<Response>((resolve , reject) =>{
        fetch(<any>imageServerURL, {
            method :'POST',
            headers : <any>imageServerRequestHeaders,
            body : JSON.stringify( {
                url : src
            })
        }).then( (data : Response) => resolve(data))
        .catch( (err : Error ) => reject(err))
    })
 };

export const isSvgFile = (src: string) => {
    return new Promise((resolve, reject) => {
                resolve(false)        
    })
}

export const cellPhoneSVGPath = `<?xml version="1.0" encoding="iso-8859-1"?>
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="<<x-axis>>" y="<<y-axis>>"
	 width="<<width>>" height="<<height>>" viewBox="0 0 792 792" style="enable-background:new 0 0 792 792;" xml:space="preserve">
<g>
	<path fill="#ffffff" d="M557.75,792c0,0,71.889,0,71.889-71.997V71.997C629.639,0,557.75,0,557.75,0h-323.5c0,0-71.889,0-71.889,71.997v648.006
		C162.361,792,234.25,792,234.25,792H557.75z M396,762.022c-19.841,0-35.944-16.104-35.944-35.944
		c0-19.842,16.103-35.944,35.944-35.944s35.945,16.103,35.945,35.944C431.945,745.919,415.842,762.022,396,762.022z M306.139,43.888
		c0-4.457,3.559-7.944,7.944-7.944h163.8c4.385,0,7.979,3.559,7.979,7.944v2.121c0,4.493-3.559,7.944-7.943,7.944H314.083
		c-4.349,0-7.944-3.559-7.944-7.944V43.888z M198.306,89.861h395.389v575.111H198.306V89.861z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`;


export const getFrameTextSize = (configSize: number, textLength: number) => {
    let factor;

    // if (textLength >= 0 && textLength <= 12) {
    //     factor = 10;
    // } else if (textLength <= 16) {
    //     factor = 12;
    // } else if (textLength <= 20) {
    //     factor = 14;
    // } else if (textLength <= 27) {
    //     factor = 16;
    // } else if (textLength <= 30) {
    //     factor = 18;
    // } else {
    //     throw new Error('Frame text should be between 0 to 30 characters')
    // }

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