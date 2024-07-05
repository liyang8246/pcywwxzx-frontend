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
        inputError: false,
        submitForm() {
            fetch('http://eromanga.top:5800/api/issue', {
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
            fetch('http://eromanga.top:5800/api/verifycode?_='+Date.now())
                .then(response => response.text())
                .then(text => { this.reswithverifycode.verifycode_url = text })
        },

        validateInput() {
            const response = this.reswithverifycode.response;
            this.inputError = false;
            if (response.uid.length != 11)  this.inputError = "学号必须为11位";
            if (response.name.length < 2)  this.inputError = "姓名必须大于2位";
            if (response.name.length > 4)  this.inputError = "姓名必须小于4位";
            if (response.class.length < 5)  this.inputError = "班级必须大于6位";
            if (response.problem.length < 2)  this.inputError = "问题必须大于2位";
            if (response.reg_time && response.app_time) {
                const reg_time = new Date(response.reg_time);
                const app_time = new Date(response.app_time);
                if (reg_time > app_time) {
                    this.inputError = "预约时间必须大于当天";
                }
            }
            if (!(response.uid && response.name && response.class && response.problem && response.app_time)) {
                this.inputError = "未完成输入";
            }
            if (!this.inputError) {
                this.submitForm();
            }
        },
    }));
});