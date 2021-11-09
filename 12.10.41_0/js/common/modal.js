class Modal {
    constructor() {
        this.$modal = document.createElement('div');
        this.$modal.className = 'modal-67373';
    }

    initModal(title, contentHtml, footerHtml) {
        let self = this;
        self.$modal.innerHTML = `
        <div class="modal-67373-content">
            <div class="modal-67373-header">
                <h4 class="modal-67373-title">${title}</h4>
                <span class="close-67373">&times;</span>
            </div>
            <div class="modal-67373-body">${contentHtml}</div>
            <div class="modal-67373-footer">${footerHtml}</div>
        </div>`;
        document.body.appendChild(self.$modal);
        self.$modal.querySelector('span.close-67373').onclick = function () {
            self.$modal.style.display = "none";
        };
        window.onclick = function (event) {
            if (event.target == self.$modal)
                self.$modal.style.display = "none";
        };
        return self.$modal;
    }

    insertModalBtn ($parent, btnText) {
        if ($parent && $parent.nodeType === Node.ELEMENT_NODE) {
            let $modalBtn = document.createElement('button');
            $modalBtn.innerText = btnText;
            $modalBtn.className = 'btn-67373';
            $parent.appendChild($modalBtn);
            return $modalBtn;
        }
    }
    
    modalToggle() {
        if (this.$modal.style.display === "block") {
            this.$modal.style.display = "none";
        } else {
            this.$modal.style.display = "block";
        }
    }

}