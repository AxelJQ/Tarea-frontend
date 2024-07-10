import { Component } from '@angular/core';
import { CategoriaListComponent } from '../../components/categoria/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from '../../components/categoria/categoria-form/categoria-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CategoriaListComponent,
    CategoriaFormComponent,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
  public roleId: number = 0;

  constructor() {
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.roleId = JSON.parse(user)?.role.id;
    } 
  }
}
