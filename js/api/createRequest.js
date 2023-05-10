/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    console.log("make request");
    const xhr = new XMLHttpRequest;
    xhr.responseType = 'json';
    xhr.open(options.method, options.url);
    xhr.setRequestHeader("Authorization", `OAuth ${Yandex.Token}`);

    try {
        xhr.onload = options.callback; 
        xhr.send();
    } catch(err) {
        alert(err.name);
        alert(err.massage);
    };
};
