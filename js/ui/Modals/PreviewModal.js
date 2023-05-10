/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal{
  constructor(element) {
    super(element);
    this.btnClose = document.getElementsByClassName("ui close button")[1];
    this.content = document.querySelectorAll(".scrolling.content")[1];
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    // Закрытие модального окна по клику на крестик
    document.querySelector(".uploaded-previewer-modal").addEventListener("click", (e) => {
      if (e.target.className == "x icon") {
        super.close();
        this.content.innerHTML = "";
      };
    });

    // Управление изображением:
    this.content.addEventListener("click", (e) => {
      let callback = (response) => {
        console.log(response.target.status);
        e.target.closest(".image-preview-container").remove();
      };

      // 1) удаление
      if ((e.target.className == "ui labeled icon red basic button delete") || (e.target.className == "trash icon")) {
        let path = e.target.closest("button").getAttribute("data-path").replace("disc:/", "").replace("/", "%2F");
      
        Yandex.removeFile(path, callback);

      // 2) скачивание
      } else if ((e.target.className == "ui labeled icon violet basic button download") || (e.target.className == "download icon")) {
        let url = e.target.closest("button").getAttribute("data-file");

        Yandex.downloadFileByUrl(url);
      };
    });
  };


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    for (let el of data) {
      if (el.media_type == "image") {
        let changeDate = this.formatDate(el.created);
        console.log(el)
        this.content.innerHTML += this.getImageInfo({
          src: el.preview,
          name: el.name,
          date: changeDate,
          size: el.size,
          path: el.path,
          url: el.file
        });
      };
    };
  };


  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    let oldDate = new Date (date);
    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
    };
    return oldDate.toLocaleString("ru", options);
  };

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    let markup = `
      <div class="image-preview-container">
        <img src=${item.src} />
        <table class="ui celled table">
          <thead>
            <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
          </thead>
          <tbody>
            <tr><td>${item.name}</td><td>${item.date}</td><td>${item.size}Кб</td></tr>
          </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path=${item.path}>
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file=${item.url}>
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>
    `;

    return markup;
  };
};
