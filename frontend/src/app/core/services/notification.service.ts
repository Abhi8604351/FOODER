import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private toastr = inject(ToastrService);

    success(message: string, title: string = 'Success') {
        this.toastr.success(message, title, {
            progressBar: true,
            closeButton: true,
            timeOut: 3000,
        });
    }

    error(message: string, title: string = 'Error') {
        this.toastr.error(message, title, {
            progressBar: true,
            closeButton: true,
            timeOut: 5000,
        });
    }

    info(message: string, title: string = 'Info') {
        this.toastr.info(message, title, {
            progressBar: true,
            closeButton: true,
        });
    }

    warning(message: string, title: string = 'Warning') {
        this.toastr.warning(message, title, {
            progressBar: true,
            closeButton: true,
        });
    }
}
