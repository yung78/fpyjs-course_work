/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);
    this.btnClose = document.getElementsByClassName("ui close button")[0];
    this.content = document.querySelectorAll(".scrolling.content")[1];
    this.sendBtn = document.querySelector(".ui.send-all.button");
    this.registerEvents();
  };

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    // Закрытие модального окна по клику на крестик
    this.element[0].addEventListener("click", (e) => {
      if (e.target.className == "x icon") {
        super.close();
        this.clearImages();
      };
    });

    // Закрытие модального окна по клику на кнопку "Закрыть"
    this.btnClose.addEventListener("click", (e) => {
      e.preventDefault();
      super.close();
      this.clearImages();
    });

    // Отправляет все изображения модального окна на диск
    this.sendBtn.addEventListener("click", () => {
      this.sendAllImages()
    });

    // Отправляет/удаляет одно изображение
    this.content.addEventListener("click", (e) => {
      // Отправка
      if ((e.target.className == "ui button") || (e.target.className == "upload icon")) {
        let image = e.target.closest(".ui.action.input").previousElementSibling
        
        this.sendImage({
          url: image.src,
          id: image.getAttribute("data-id"),
          img: image
        });
        // sendImage(imageContainer);
      };

      // Удаление (добавил от себя)
      if (e.target.className == "x icon img") {
        e.target.closest(".image-preview-container").remove();
      };
    });

  };

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    this.content.innerHTML += images;
  };

  /**
   * Удаляет все полученные изображения в теле всплывающего окна
   */
  clearImages() {
    this.content.innerHTML = "";
  };

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    let containerMarkup = `
      <div class="image-preview-container">
        <i class="x icon img"></i>
        <img src=${item.url} class="upload_file" data-id=${item.id} />
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button"><i class="upload icon"></i></button>
        </div>
      </div>
    `;

    return containerMarkup;
  };

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages(){
    // Проверка наличия изображений в модальном окне
    if (this.content.innerHTML.trim() == "") {
      alert("Отсутствуют изображения для отправки");
    } else {
      console.log("Send all");
      let sendImages = document.getElementsByClassName("upload_file");
      
    // Отправка всех изображений
      for (let el of sendImages) {
        this.sendImage({
          url: el.src,
          id: el.getAttribute("data-id"),
          img: el
        });
      };
    };
  };

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer){
    let path = imageContainer.img.closest(".image-preview-container").querySelector("input").value;
    let yaPath = "";
    
    // Проверка создания папки и заполнения поля ввода:
    // 1)если поле ввода input ПУСТОЕ, добавляем класс error блоку с классом input
    if (!path.trim()) {
      imageContainer.img.nextElementSibling.className += " error";
      return;
      // 2)если в поле ввода input заданы имя папки и имя файла
    } else if (path.includes("/")) {
      yaPath = path.replaceAll("/", "%2F").trim();
      // 3)если в поле ввода input задано только имя файла сохраняем в корень
    } else {
      yaPath = `%2F${path.trim()}`;
    };

    imageContainer.img.nextElementSibling.className += " disabled"

    let url = imageContainer.url
      .replaceAll("/", "%2F")
      .replaceAll(":", "%3A")
      .replaceAll("?","%3F")
      .replaceAll("=","%3D")
      .replaceAll("&","%26");
    
    let callback = (response) => {
      console.log(response.target.status);
      if (response.target.status > 207) {
        alert(response.target.response.message);
      } else {
        imageContainer.img.closest(".image-preview-container").remove();
        if (!this.content.innerHTML.trim()) {
          super.close();
        };
      };
    };

    Yandex.uploadFile(yaPath, url, callback);
  };
};