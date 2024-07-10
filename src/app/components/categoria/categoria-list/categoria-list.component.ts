import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ICategoria } from '../../../interfaces';
import { CategoriaService } from '../../../services/categoria.service';
import { CategoriaFormComponent } from '../categoria-form/categoria-form.component';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    CategoriaFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.scss'
})
export class CategoriaListComponent {
  public roleId: number = 0;
  public search: String = '';
  public categoriaList: ICategoria[] = [];
  private service = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  public currentCategoria: ICategoria = {
    nombre: '',
    descripcion: ''
  };

  constructor() {
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.roleId = JSON.parse(user)?.role.id;
    }
    this.service.getAllSignal();
    effect(() => {
      this.categoriaList = this.service.categorias$();
    });
  }

  showDetail(categoria: ICategoria, modal: any) {
    this.currentCategoria = {...categoria};
    modal.show();
  }

  deleteCategoria(categoria: ICategoria) {
    this.service.deleteCategoriaSignal(categoria).subscribe({
      next: () => {
        this.snackBar.open('Categoria deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting categoria', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
