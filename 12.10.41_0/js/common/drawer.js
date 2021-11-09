class Drawer {
    constructor () {
        this.$drawer;
        this.$drawerContent;
        this.$dropdownContent;
    }

    insertDrawer ($parent) {
        if ($parent && $parent.nodeType === Node.ELEMENT_NODE) {
            if (!$parent.style.position)
                $parent.style.position = 'relative';
            this.initDrawer();
            $parent.prepend(this.$drawer);
        }
    }

    initDrawer () {
        if (this.$drawer) {
            this.clearDrawer();
        } else {
            this.$drawerContent = document.createElement('div');
            this.$drawerContent.className = 'drawer-67373-content';
            
            let $btn = document.createElement('button');
            $btn.className = 'btn-67373 drawer-67373-btn';
            $btn.innerHTML = '<i class="arrow-67373"></i>';
            $btn.onclick = function() { 
                this.parentElement.classList.toggle("open");
                this.classList.toggle("open");
                this.firstElementChild.classList.toggle("left");
            };
    
            this.$drawer = document.createElement('div');
            this.$drawer.className = 'drawer-67373';
            this.$drawer.appendChild(this.$drawerContent);
            this.$drawer.appendChild($btn);
        }
    }

    clearDrawer () {
        if (this.$drawerContent) {
            this.$drawerContent.innerHTML = '';
        }
    }

    initDropdown () {
        let self = this;
        self.$dropdownContent = document.createElement('div');
        self.$dropdownContent.className = 'dropdown-67373-content';

        let $btn = document.createElement('button');
        $btn.className = 'btn-67373 btn-67373-icon';
        $btn.innerHTML = '<i class="arrow-67373 down"></i>';
        $btn.onclick = function() { 
            self.$dropdownContent.classList.toggle("show");
        };

        let $dropdown = document.createElement('div');
        $dropdown.className = 'dropdown-67373';
        $dropdown.appendChild($btn);
        $dropdown.appendChild(self.$dropdownContent);

        window.onclick = function(event) {
            if (event.target != $btn && self.$dropdownContent.classList.contains('show')) {
                self.$dropdownContent.classList.remove('show');
            }
        }
        return $dropdown;
    }
}