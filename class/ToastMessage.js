import { Toast } from 'native-base';

var durationDef = 5000

export default class ToastMessage {
    static showCustom(pMessage, pDuration, pPosition, pTextStyleColor, pButtonText, pType) {
        var valueColor = ((pTextStyleColor == '' || pTextStyleColor == null) ? '#fff' : pTextStyleColor)

        Toast.show({
            text: pMessage,
            duration: pDuration,
            position: pPosition,
            textStyle: { color: valueColor },
            buttonText: pButtonText,
            type: pType
        });
    }

    static showSuccess(pMessage) {
        Toast.show({
            text: pMessage,
            duration: durationDef,
            position: 'bottom',
            textStyle: { color: '#fff' },
            type: 'success'
        });
    }

    static showWarning(pMessage) {
        Toast.show({
            text: pMessage,
            duration: durationDef,
            position: 'bottom',
            textStyle: { color: '#fff' },
            type: 'warning'
        });
    }

    static showDanger(pMessage) {
        Toast.show({
            text: pMessage,
            duration: durationDef,
            position: 'bottom',
            textStyle: { color: '#fff' },
            type: 'danger'
        });
    }
}
