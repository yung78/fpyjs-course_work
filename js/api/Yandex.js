/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';
  static Token = "";
  static folderName = "";
  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
    Yandex.Token = localStorage.getItem("YaToken");
    if (!Yandex.Token) {
      Yandex.Token = prompt("Введите токен Yandex");
      localStorage.setItem("YaToken", Yandex.Token);
    };
  };

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    createRequest({
      method: "POST",
      url: `${Yandex.HOST}/resources/upload?path=${path}&url=${url}`,
      callback: callback
    });
  };

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback) {
    createRequest({
      method: "DELETE",
      url: `${Yandex.HOST}/resources?path=${path}`,
      callback: callback
    })
  };

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) { 
    Yandex.getToken()

    createRequest({
      method: "GET",
      url: `${Yandex.HOST}/resources/files`,
      callback: callback
    })
  };

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url) {
    let href = document.createElement("a");
    href.href = url;
    href.click();
  };
};
