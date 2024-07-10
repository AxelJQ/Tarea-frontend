import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { ICategoria } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CategoriaService extends BaseService<ICategoria> {
    protected override source: string = 'categorias';
    private categoriaListSignal = signal<ICategoria[]>([]);

    get categorias$() {
        return this.categoriaListSignal;
    }

    getSignal(categoria: ICategoria) {
        this.find(categoria.id).subscribe({
            next: (response: any) => {
                response.reverse();
                this.categoriaListSignal.set(response);
            },
            error: (error: any) => {
                console.error('Error fetching categoria', error);
            }
        })
    }

    getAllSignal() {
        this.findAll().subscribe({
            next: (response: any) => {
                response.reverse();
                this.categoriaListSignal.set(response);
            },
            error: (error: any) => {
                console.error('Error fetching categorias', error);
            }
        });
    }

    saveCategoriaSignal(categoria: ICategoria): Observable<any>{
        return this.add(categoria).pipe(
            tap((response: any) => {
                this.categoriaListSignal.update( categorias => [response, ...categorias]);
            }),
            catchError(error => {
                console.error('Error saving categoria', error);
                return throwError(error);
            })
        );
    }

    updateCategoriaSignal(categoria: ICategoria): Observable<any>{
        return this.edit(categoria.id, categoria).pipe(
            tap((response: any) => {
                const updatedCategorias = this.categoriaListSignal().map(c => c.id === categoria.id ? response : c);
                this.categoriaListSignal.set(updatedCategorias);
            }),
            catchError(error => {
                console.error('Error updating categoria', error);
                return throwError(error);
            })
        );
    }

    deleteCategoriaSignal(categoria: ICategoria): Observable<any>{
        return this.del(categoria.id).pipe(
            tap((response: any) => {
                const updatedCategorias = this.categoriaListSignal().filter(c => c.id !== categoria.id);
                this.categoriaListSignal.set(updatedCategorias);
            }),
            catchError(error => {
                console.error('Error deleting categoria', error);
                return throwError(error);
            })
        );
    }
}