import { Component } from '@angular/core';
import { ProductoListComponent } from '../../components/producto/producto-list/producto-list.component';
import { ProductoFormComponent } from '../../components/producto/producto-form/producto-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    ProductoListComponent,
    ProductoFormComponent,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  public roleId: number = 0;

  constructor() {
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.roleId = JSON.parse(user)?.role.id;
    }
  }
}
