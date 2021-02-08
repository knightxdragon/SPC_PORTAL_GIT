import validation from '../assets/js/validate.min.js'

export default function validate(fieldName, value) {
    var constraints = {
        user: {
            presence: {
                allowEmpty: false,
                message: "^Bạn chưa nhập <Tên tài khoản>" // Dấu ^ phía đầu câu để loại bỏ thuộc tính mặc định thêm vào mỗi câu message
            },
        },
        pass: {
            presence: {
                allowEmpty: false,
                message: "^Bạn chưa nhập <Mật khẩu>"
            },
        },
        donvi: {
            presence: {
                allowEmpty: false,
                message: "^Bạn chưa chọn <Đơn vị>"
            },
        }
    };

    var formValues = {}
    formValues[fieldName] = value

    var formFields = {}
    formFields[fieldName] = constraints[fieldName]


    const result = validation(formValues, formFields)

    if (result) {
        return result[fieldName][0]
    }

    return null
}