class View {
   constructor() {
      this.wrapper = document.querySelector(".wrapper");
      this.searchWrapper = this.wrapper.querySelector(".search-input");
      this.input = this.searchWrapper.querySelector("input");
      this.suggBox = this.searchWrapper.querySelector(".autocomplete");
      // this.searchWrapper = this.createElement("div", "search-input");
      // this.input = this.createElement("input");
      // this.suggBox = this.createElement("ul", "autocomplete");

      this.searchWrapper.append(this.input);
      this.searchWrapper.append(this.suggBox);

      this.userWrapper = this.createElement("div", "users-wrapper");
      this.usersList = this.createElement("ul", "user-list");
      this.usersButton = this.createElement("button", "user-list__button");
      this.userWrapper.append(this.usersList);

      this.users = this.createElement("div", "users");
      this.users.append(this.userWrapper);

      this.searchWrapper.append(this.users);

      this.wrapper.append(this.searchWrapper);
      // this.wrapper.append(this.users);
   }

   createElement(elementTag, elementClass) {
      const element = document.createElement(elementTag);
      if (elementClass) {
         element.classList.add(elementClass);
      }
      return element;
   }

   createComplete(userData) {
      let userElement = this.suggBox.querySelector("li");
      if (!userElement) {
         this.suggBox.innerHTML = `<li><p class="user-prev-name">${userData.name}</p></li>
         <li><p class="user-prev-name">${userData.name}</p></li>
         <li><p class="user-prev-name">${userData.name}</p></li>
         <li><p class="user-prev-name">${userData.name}</p></li>
         <li><p class="user-prev-name">${userData.name}</p></li>`;
         userElement = this.suggBox.querySelector("li");
      }
      userElement.style.display = "flex";
      userElement.innerHTML = `<p class="user-prev-name">${userData.name}</p>`;
      this.suggBox.append(userElement);

      const usersButton = this.createElement("button", "user-list__button");
      usersButton.innerHTML = `<img src="img/left-line.png" alt="Button line">
                              <img src="img/right-line.png" alt="Button line">`;
      userElement.addEventListener("click", () => {
         userElement.innerHTML = `<div class="user-list__text">
                              <p>Name: ${userData.name}</p>
                              <p>Owner: ${userData.owner.login}</p>
                              <p>Stars: ${userData.stargazers_count}</p>
                                 </div>`;
         this.input.value = "";
         if (this.input.value === "") {
            this.usersList.style.marginTop = "45px";
         }
         this.suggBox.innerHTML = "";
         userElement.append(usersButton);
         this.usersList.append(userElement);
         usersButton.addEventListener("click", () => {
            userElement.style.display = "none";
         });
      });
   }
}
class Search {
   constructor(view) {
      this.view = view;

      this.view.searchWrapper.addEventListener(
         "keyup",
         this.debounce(this.searchUsers.bind(this), 500)
      );
   }
   async searchUsers() {
      const searchValue = this.view.input.value;
      if (searchValue) {
         return await fetch(
            `https://api.github.com/search/repositories?q=${this.view.input.value}&per_page=5&page=`
         ).then((res) => {
            if (res.ok) {
               res.json().then((res) => {
                  res.items.forEach((user) => this.view.createComplete(user));
               });
            }
         });
      } else {
         this.clearUsers();
      }
   }
   clearUsers() {
      this.view.suggBox.innerHTML = "";
   }
   debounce(func, wait, immediate) {
      let timeout;
      return function () {
         const context = this,
            args = arguments;
         const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
         };
         const callNow = immediate && !timeout;
         clearTimeout(timeout);
         timeout = setTimeout(later, wait);
         if (callNow) func.apply(context, args);
      };
   }
}
new Search(new View());
