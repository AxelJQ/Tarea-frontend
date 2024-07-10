import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IProducto } from '../../../interfaces';
import { ProductoService } from '../../../services/producto.service';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    ProductoFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.scss'
})
export class ProductoListComponent {
  public roleId: number = 0;
  public search: String = '';
  public productoList: IProducto[] = [];
  private service = inject(ProductoService);
  private snackBar = inject(MatSnackBar);
  public currentProducto: IProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidadStock: 0,
    categoria: { id: 0 }
  };

  constructor() {
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.roleId = JSON.parse(user)?.role.id;
    }
    this.service.getAllSignal();
    effect(() => {
      this.productoList = this.service.productos$();
    });
  }

  showDetail(producto: IProducto, modal: any) {
    this.currentProducto = {...producto};
    modal.show();
  }

  deleteProducto(producto: IProducto) {
    this.service.deleteProductoSignal(producto).subscribe({
      next: () => {
        this.snackBar.open('Producto deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting producto', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
