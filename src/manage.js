document.addEventListener('alpine:init', () => {
    Alpine.data('appointmentForm', () => ({
        passwd: '',
        error: '',
        pass: false,
        reswithverifycode: [],
        get_issue() {
            const url = `https://eromanga.top:5800/api/issue?passwd=${this.passwd}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.reswithverifycode = data;
                    this.pass = true;
                })
                .catch(error => this.error = error);
        },

        str_to_date(str) {
            const appDate = new Date(str);
            return `${String(appDate.getMonth() + 1).padStart(2, '0')}月${String(appDate.getDate()).padStart(2, '0')}日`;
        },

        toggle_issue(id) {
            const url = `https://eromanga.top:5800/api/issue?passwd=${this.passwd}&id=${id}`;
            fetch(url,
                { method: 'POST' }
            )
                .then(_ => this.get_issue())
                .catch(error => this.error = error);
        },

        del_issue(id) {
            const url = `https://eromanga.top:5800/api/issue?passwd=${this.passwd}&id=${id}`;
            fetch(url,
                { method: 'DELETE' }
            )
                .then(_ => this.get_issue())
                .catch(error => this.error = error);
        },
    }));
});