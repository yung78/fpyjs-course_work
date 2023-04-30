/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    console.log("make request");
    const xhr = new XMLHttpRequest;
    xhr.responseType = 'json';
    xhr.open(options.method, options.url);
    xhr.setRequestHeader("Authorization", `OAuth ${Yandex.Token}`);
    xhr.onload = options.callback;
    xhr.send();

    // Конструкция ниже ошибки response не ловит

    // пробовал при статусе >205 new Error -  тоже не работает
    // try {
    //     xhr.open(options.method, options.url);
    //     xhr.setRequestHeader("Authorization", `OAuth ${Yandex.token}`);
    //     xhr.send();
    // } catch(err) {
    //     alert(err.name);
    //     alert(err.massage);
    // }
};
