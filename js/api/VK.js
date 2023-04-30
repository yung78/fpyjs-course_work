/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = 'vk1.a.LajfWzgWFUWL7MFQo0By-e9bQT3AFa45ZfDawk0JaVrhLhzkJCXCXW1emGDnDF31NjEqWtiCg4Q60APH2F9rc2yvwc0eDmwwE1zbOvZ_J0Zt39oMCgewpmpwYYqODwYytYHtuVvMu_15ZC9z6wDodDTLBY4oCg2H033_pB1r5fE_thG2mPQ7a0ZJUyAGl35hxyg58OUGz03ggpcDe1WLMA';
  static lastCallback;

  /** 
   * Получает изображения
   */
  static get(id="", callback) {
    VK.lastCallback = callback;
    let script = document.createElement("script");
    script.className = "get_photo_vk_script";
    script.src = `https://api.vk.com/method/photos.getAll?owner_id=${id}&v=5.131&access_token=${VK.ACCESS_TOKEN}&callback=VK.processData`;
    document.getElementsByTagName("body")[0].appendChild(script);
  };

  /** 
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    document.querySelector(".get_photo_vk_script").remove();
    if (result.error) {
      return alert(`Error (error code: ${result.error.error_code}, error message: ${result.error.error_msg})`);
    };
    let photos = [];
    for (let el of result.response.items) {
      let bigSizePhoto = el.sizes.sort((prev, next) =>  next.width - prev.width)[0];
      photos.push({
        "date": VK.getDateTime(el.date),  
        "id": el.id,
        "url": bigSizePhoto.url
      });
    };
    
    VK.lastCallback(photos);
    VK.lastCallback = (() => {});
  };

  /** 
   * Является обработчиком временной метки UNIX для корректной записи даты в колбэк (никто не ответил в дискорде, какие данные тянуть из VK)
   */
  static getDateTime(unix) {
    let date = new Date(unix * 1000);
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    let year = date.getFullYear();
    // let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    // let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let formatted = `${day}.${month}.${year}`;
    // let formatted = `${hours}:${minutes}, ${day}.${month}.${year}`;
    
    return formatted
  }
};

