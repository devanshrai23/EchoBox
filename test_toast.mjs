import { Toast } from '@base-ui/react/toast';
const toastManager = Toast.createToastManager();
console.log(Object.keys(toastManager));
console.log(typeof toastManager.create);
console.log(typeof toastManager.add);
console.log(typeof toastManager.show);
console.log(typeof toastManager.push);
