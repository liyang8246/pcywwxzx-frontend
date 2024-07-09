document.addEventListener('alpine:init', () => {
    Alpine.data('appointmentForm', () => ({
        reswithverifycode: {
            verifycode: '',
            verifycode_url: '',
            response: {
                id: null,
                uid: '',
                name: '',
                class: '',
                problem: '',
                reg_time: null,
                app_time: '',
                closed: null,
                closed_time: null,
            },
        },
        error: '',
        info: '',
        userAgreement: false,
        submitForm() {
            this.error = '';
            this.info = '';
            if (!this.userAgreement) {
                this.error = "请同意用户协议";
                return;
            }
            if (this.reswithverifycode.response.app_time.length < 20) {
                this.reswithverifycode.response.app_time = this.reswithverifycode.response.app_time + "T00:00:00.000000000"
            }
            fetch('http://192.168.100.140:5800/api/issue', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.reswithverifycode)
            })
                .then(response => {
                    if (response.status == 200) {
                        this.info = response.text();
                        this.reswithverifycode.response.uid = '';
                        this.reswithverifycode.response.name = '';
                        this.reswithverifycode.response.class = '';
                        this.reswithverifycode.response.problem = '';
                        this.reswithverifycode.response.app_time = '';
                    } else {
                        this.error = response.text();
                        this.reswithverifycode.response.app_time = this.reswithverifycode.response.app_time.slice(0, 10);
                        this.getVerifyCode();
                    }
                })
                .catch(error => this.error = error);
        },

        getVerifyCode() {
            fetch('http://192.168.100.140:5800/api/verifycode?_=' + Date.now())
                .then(response => response.text())
                .then(text => { this.reswithverifycode.verifycode_url = text })
        },

        validateInput() {
            const response = this.reswithverifycode.response;
            this.error = false;
            if (response.uid.length != 11) this.error = "学号必须为11位";
            if (response.name.length < 2) this.error = "姓名必须大于2位";
            if (response.name.length > 4) this.error = "姓名必须小于4位";
            if (response.class.length < 5) this.error = "班级必须大于6位";
            if (response.problem.length < 2) this.error = "问题必须大于2位";
            if (response.reg_time && response.app_time) {
                const reg_time = new Date(response.reg_time);
                const app_time = new Date(response.app_time);
                if (reg_time > app_time) {
                    this.error = "预约时间必须大于当天";
                }
            }
            if (!(response.uid && response.name && response.class && response.problem && response.app_time)) {
                this.error = "未完成输入";
            }
            if (!this.error) {
                this.submitForm();
            }
        },
    }));
});