document.addEventListener('alpine:init', () => {
    Alpine.data('appointmentForm', () => ({
        reswithverifycode: {
            verifycode: '',
            verifycode_url: '',
            response: {
                uid: '',
                name: '',
                class: '',
                problem: '',
                reg_time: null,
                app_time: ''
            },
        },
        submitForm() {
            fetch('http://127.0.0.1:5800/api/issue', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.reswithverifycode)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        },

        getVerifyCode() {
            fetch('http://127.0.0.1:5800/api/verifycode')
                .then(response => response.text())
                .then(text => {this.reswithverifycode.verifycode_url = text})
        }
    }));
});