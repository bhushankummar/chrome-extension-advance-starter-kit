const jQuery = window.jQuery;
import { environment } from './environment.js';

const baseURL = environment.API_URL.concat('api/v1/');

export const post = (url, postData = {}) => {
    return new Promise((resolve, reject) => {
        const request = jQuery.ajax({
            url: baseURL.concat(url),
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(postData),
            dataType: 'JSON'
        });

        request.done((data) => {
            resolve(data);
        });

        request.fail((xhr, /* errorType, exception */) => {
            // console.log('jqXHR ', xhr);
            // console.log('errorType ', errorType);
            // console.log('exception ', exception);
            // console.log('xhr.responseText ', xhr.responseText);
            reject(xhr.responseText);
        });
    });
};

export const get = (url) => {
    return new Promise((resolve, reject) => {
        const request = jQuery.ajax({
            url: baseURL.concat(url),
            method: 'GET',
            contentType: 'application/json; charset=utf-8'
        });

        request.done((data) => {
            resolve(data);
        });

        request.fail((xhr, /* errorType, exception */) => {
            // console.log('jqXHR ', xhr);
            // console.log('errorType ', errorType);
            // console.log('exception ', exception);
            // console.log('xhr.responseText ', xhr.responseText);
            reject(xhr.responseText);
        });
    });
};
