import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IProducto, IFeedBackMessage, IFeedbackStatus } from '../../../interfaces';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent {
  @Input() title!: string;
  @Input() producto: IProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidadStock: 0,
    categoria: { id: 0 }
  };
  @Input() action: string = 'add';
  service = inject(ProductoService);
  feedbackMessage: IFeedBackMessage = { type: IFeedbackStatus.default, message: '' };

  handleAction (form: NgForm) {
    if(form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.service[ this.action == 'add' ? 'saveProductoSignal': 'updateProductoSignal'](this.producto).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `Producto successfully ${this.action == 'add' ? 'added': 'updated'}`
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        }
      });
    }
  }
}

