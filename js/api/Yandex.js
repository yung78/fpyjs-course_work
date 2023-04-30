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
    let loadItem = localStorage.getItem("YaToken") || 0;
    if (loadItem) {
      Yandex.Token = loadItem;
    } else {
      Yandex.Token = prompt("Введите токен Yandex");
      localStorage.setItem("YaToken", Yandex.Token);
    };
  };

  /**
   * Метод создания папки (добавил)
   */
  static createFolder() {
    if (Yandex.folderName.trim()) {
      createRequest({
        method: "PUT",
        url: `${Yandex.HOST}/resources?path=${Yandex.folderName}`, // path=jsCloudSaver
        callback: (response) => { // если добавить аргумент err перед response - он туда ответ запаковывает, а response = undefined
          console.log(response.target.status);
          if ((response.target.status > 207) && (response.target.status != 409)) {
            alert(response.target.response.message);
          }  else if (response.target.status == 409) {
            alert(`Папка найдена, все изображения будут сохранены в ${Yandex.folderName}`);
          } else {
            alert(`Папка ${Yandex.folderName} создана`);
          };
        }
      });
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
    let path  // можно сделать запрос папки(пути) при использовании просмотра без загрузки на диск

    if (Yandex.folderName){
      path = Yandex.folderName;
    } else {
      path = "/"  // Без заданной папки грузит из корня
    };

    createRequest({
      method: "GET",
      url: `${Yandex.HOST}/resources?path=${path}`,
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
