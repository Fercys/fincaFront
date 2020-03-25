import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  showSuccess(title, message = ''){
    Swal.fire({
      icon: 'success',
      title: title,
      text: message
    })
  }
  showInfo(title, message = ''){
    Swal.fire({
      icon: 'info',
      title: title,
      text: message
    })
  }
  showWarning(title, message = ''){
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message
    })
  }
  showError(title, message = null) {
    if(message instanceof Object) {
      let array_mesages = ''
      for (let message_value of Object.values(message)) {
        array_mesages += message_value+'<br>' 
      }
      message = array_mesages
    }
    Swal.fire({
      icon: 'error',
      title: title,
      html: message
    })
  }  
}
